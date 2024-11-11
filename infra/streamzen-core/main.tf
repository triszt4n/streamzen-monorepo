module "frontend" {
  source = "./modules/cloudfront-s3-origin"

  environment     = var.environment
  domain_name     = var.domain_name
  web_acl_arn     = aws_wafv2_web_acl.global.arn
  alb_domain_name = var.api_domain_name
  alb_api_key     = data.aws_ssm_parameter.these["alb-api-key"].value
  acm_cert_arn    = module.stream-trisz-hu-cert.arn
}

module "stream-trisz-hu" {
  source = "./modules/hosted-zone-with-records"

  name                   = "stream-trisz-hu"
  domain_name            = "stream.trisz.hu"
  delegation_set_refname = "streamzen-delegationset-stream-trisz-hu"

  simple_records = {
  }
  alias_records = {
    "${var.domain_name}" = {
      type = "A"
      records = [{
        name    = module.frontend.domain_name
        zone_id = module.frontend.hosted_zone_id
      }]
    }
    "${var.api_domain_name}" = {
      type = "A"
      records = [{
        name    = module.api.alb_dns_name
        zone_id = module.api.alb_zone_id
      }]
    }
  }
}

module "stream-trisz-hu-cert" {
  source = "./modules/acm"

  domain_name = var.domain_name
  zone_id     = module.stream-trisz-hu.zone_id
  providers = {
    aws = aws.global
  }
}

module "api-stream-trisz-hu-cert" {
  source = "./modules/acm"

  domain_name = var.api_domain_name
  zone_id     = module.stream-trisz-hu.zone_id
}

module "vpc" {
  source = "./modules/protected-vpc"

  environment = var.environment
  name        = "streamzen-api-vpc"
  cidr        = "10.10.10.0/24"
  subnets = {
    "streamzen-alb-1a" = {
      cidr   = "10.10.10.16/28"
      az     = "eu-central-1a"
      public = true
    }
    "streamzen-alb-1b" = {
      cidr   = "10.10.10.32/28"
      az     = "eu-central-1b"
      public = true
    }
    "streamzen-private-1a" = {
      cidr = "10.10.10.48/28"
      az   = "eu-central-1a"
    }
    "streamzen-private-1b" = {
      cidr = "10.10.10.64/28"
      az   = "eu-central-1b"
    }
  }
  secgroups = {
    "streamzen-alb-sg" = {
      "in-443" = {
        type      = "ingress"
        cidr      = "0.0.0.0/0"
        from_port = 443
        to_port   = 443
        protocol  = "tcp"
      }
      "in-80" = {
        type      = "ingress"
        cidr      = "0.0.0.0/0"
        from_port = 80
        to_port   = 80
        protocol  = "tcp"
      }
      "out" = {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    }
    "streamzen-private-sg" = {
      "in" = {
        type     = "ingress"
        cidr     = "10.10.10.0/24"
        protocol = "-1"
      }
      "out" = {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    }
  }
}

module "api" {
  source = "./modules/api-stack"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id

  alb_cert_arn        = module.api-stream-trisz-hu-cert.arn
  alb_tg_port_mapping = 80
  alb_secgroup_ids = [
    module.vpc.secgroups["streamzen-alb-sg"].id,
  ]
  alb_subnet_ids = [
    module.vpc.subnets["streamzen-alb-1a"].id,
    module.vpc.subnets["streamzen-alb-1b"].id,
  ]

  api_secgroup_ids = [
    module.vpc.secgroups["streamzen-private-sg"].id,
  ]
  api_subnet_ids = [
    module.vpc.subnets["streamzen-private-1a"].id,
    module.vpc.subnets["streamzen-private-1b"].id,
  ]
  api_subnet_route_table_ids = [
    for subnet in values(module.vpc.subnets) : subnet.route_table_id
  ]

  ecs = {
    dummy_image_tag = "streamzen-dummy-image-tag:7"
    health_check = {
      command = [
        "CMD-SHELL",
        "curl -f http://localhost/ || exit 1",
      ]
      retries     = 3
      startPeriod = 60
      interval    = 5
      timeout     = 10
    }
    family_name  = "streamzen-api"
    port_mapping = 80
    task_environment = {
      PORT                   = "80"
      AUTHSCH_CLIENT_ID      = data.aws_ssm_parameter.these["authsch-client-id"].value
      AUTHSCH_CLIENT_SECRET  = data.aws_ssm_parameter.these["authsch-client-secret"].value
      POSTGRES_DB            = "streamzen"
      POSTGRES_USER          = data.aws_ssm_parameter.these["db-username"].value
      POSTGRES_PASSWORD      = data.aws_ssm_parameter.these["db-password"].value
      POSTGRES_PRISMA_URL    = "postgresql://${data.aws_ssm_parameter.these["db-username"].value}:${data.aws_ssm_parameter.these["db-password"].value}@streamzen-rds-dev.czw6iqm8461h.eu-central-1.rds.amazonaws.com:5432/streamzen?schema=public"
      FRONTEND_CALLBACK      = "https://${var.domain_name}"
      JWT_SECRET             = data.aws_ssm_parameter.these["api-jwt-secret"].value
      AWS_S3_REGION          = var.region
      AWS_S3_UPLOADED_BUCKET = "streamzen-uploaded-videos-${var.environment}-bucket"
    }
    memory             = 1024
    cpu                = 1024
    desired_task_count = 1
  }

  db = {
    engine         = "postgres"
    engine_version = "16.4"
    instance_class = "db.t3.micro"
  }
}

module "jumpbox" {
  count = var.enable_jumpbox ? 1 : 0
  source = "./modules/jumpbox"
  name   = "streamzen-jumpbox-${var.environment}"

  vpc_id      = module.vpc.vpc_id
  secgroup_id = module.vpc.secgroups["streamzen-private-sg"].id
  subnet_id   = module.vpc.subnets["streamzen-alb-1a"].id
}

data "aws_secretsmanager_secret_version" "cdn_auth" {
  secret_id = aws_secretsmanager_secret.cdn_auth.id
}

module "frontend" {
  source = "./modules/cloudfront-s3-origin"

  environment     = var.environment
  domain_name     = var.domain_name
  alb_domain_name = module.api.alb_dns_name
  alb_arn         = module.api.alb_arn
  web_acl_arn     = aws_wafv2_web_acl.global.arn
  acm_cert_arn    = module.stream-trisz-hu-cert.arn
  enable_distro   = var.enable_distro

  mediapackage_origin_domain_name    = var.mediapackage_origin_domain_name
  secret_mediapackage_cdn_identifier = jsondecode(data.aws_secretsmanager_secret_version.cdn_auth.secret_string)["MediaPackageCDNIdentifier"]
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

# NETWORKING COMPONENTS ------------------------------------------------------------
module "jumpbox" {
  count  = var.enable_jumpbox ? 1 : 0
  source = "./modules/jumpbox"
  name   = "streamzen-jumpbox-${var.environment}"

  vpc_id      = module.vpc.vpc_id
  secgroup_id = module.vpc.secgroups["streamzen-private-sg"].id
  subnet_id   = module.vpc.subnets["streamzen-public-1a"].id
}

module "vpc" {
  source = "./modules/protected-vpc"

  environment = var.environment
  name        = "streamzen-api-vpc"
  cidr        = "10.10.10.0/24"
  subnets = {
    "streamzen-public-1a" = {
      cidr   = "10.10.10.16/28"
      az     = "eu-central-1a"
      public = true
    }
    "streamzen-public-1b" = {
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
    "streamzen-lambda-1a" = {
      cidr = "10.10.10.80/28"
      az   = "eu-central-1a"
    }
    "streamzen-lambda-1b" = {
      cidr = "10.10.10.96/28"
      az   = "eu-central-1b"
    }
    "streamzen-alb-1a" = {
      cidr = "10.10.10.112/28"
      az   = "eu-central-1a"
    }
    "streamzen-alb-1b" = {
      cidr = "10.10.10.128/28"
      az   = "eu-central-1b"
    }
  }
  secgroups = {
    "streamzen-alb-sg" = {
      "in-80" = {
        type      = "ingress"
        cidr      = "10.10.10.0/24"
        from_port = 80
        to_port   = 80
        protocol  = "tcp"
      }
      "out" = {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
      "cloudfront" = {
        type      = "cloudfront"
        from_port = 80
        to_port   = 80
        protocol  = "tcp"
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
    "streamzen-db-sg" = {
      "in" = {
        type      = "ingress"
        cidr      = "10.10.10.0/24"
        protocol  = "tcp"
        from_port = 5432
        to_port   = 5432
      }
      "out" = {
        type     = "egress"
        cidr     = "10.10.10.0/24"
        protocol = "-1"
      }
    }
    "streamzen-api-sg" = {
      "in" = {
        type     = "ingress"
        cidr     = "10.10.10.0/24"
        protocol = "-1"
      }
      "in-sch" = {
        type     = "ingress"
        cidr     = "152.66.0.0/16"
        protocol = "-1"
      }
      "out" = {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    }
    "streamzen-lambda-sg" = {
      "in-443" = {
        type      = "ingress"
        cidr      = "10.10.10.0/24"
        from_port = 443
        to_port   = 443
        protocol  = "tcp"
      }
      "in-80" = {
        type      = "ingress"
        cidr      = "10.10.10.0/24"
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
  }
}

module "api" {
  source = "./modules/api-stack"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id

  alb_tg_port_mapping = 80
  alb_secgroup_ids    = [module.vpc.secgroups["streamzen-alb-sg"].id]
  alb_subnet_ids      = [module.vpc.subnets["streamzen-alb-1a"].id, module.vpc.subnets["streamzen-alb-1b"].id]
  alb_internal        = true # does not need to be internet-facing

  db_secgroup_ids = [module.vpc.secgroups["streamzen-db-sg"].id]
  db_subnet_ids   = [module.vpc.subnets["streamzen-private-1a"].id, module.vpc.subnets["streamzen-private-1b"].id]

  api_secgroup_ids           = [module.vpc.secgroups["streamzen-api-sg"].id]
  api_subnet_ids             = [module.vpc.subnets["streamzen-public-1a"].id, module.vpc.subnets["streamzen-public-1b"].id]
  api_subnet_route_table_ids = [for s in values(module.vpc.subnets) : s.route_table_id]

  ecs = {
    dummy_image_tag = "streamzen-dummy-image-tag:11"
    family_name     = "streamzen-api"
    port_mapping    = 80
    task_environment = {
      PORT                   = "80"
      AUTHSCH_CLIENT_ID      = data.aws_ssm_parameter.these["authsch-client-id"].value
      AUTHSCH_CLIENT_SECRET  = data.aws_ssm_parameter.these["authsch-client-secret"].value
      POSTGRES_DB            = "streamzen"
      POSTGRES_USER          = data.aws_ssm_parameter.these["db-username"].value
      POSTGRES_PASSWORD      = data.aws_ssm_parameter.these["db-password"].value
      FRONTEND_CALLBACK      = "https://${var.domain_name}"
      JWT_SECRET             = data.aws_ssm_parameter.these["api-jwt-secret"].value
      AWS_S3_REGION          = var.region
      AWS_S3_UPLOADED_BUCKET = "streamzen-uploaded-videos-${var.environment}-bucket"
    }
    memory             = 512
    cpu                = 256
    desired_task_count = var.enable_ecs ? 1 : 0
  }

  db = {
    engine         = "postgres"
    engine_version = "16.4"
    instance_class = "db.t3.micro"
  }
}

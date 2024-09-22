module "frontend" {
  source = "./modules/cloudfront-s3-origin"

  environment = var.environment
  domain_name = var.domain_name
  # web_acl_arn     = aws_wafv2_web_acl.global.arn
  alb_domain_name = var.api_domain_name
  alb_api_key     = data.aws_ssm_parameter.api_key.value
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
  }
}

module "stream-trisz-hu-cert" {
  source = "./modules/acm"

  domain_name = var.domain_name
  zone_id = module.stream-trisz-hu.zone_id
  providers = {
    aws = aws.global
  }
}

module "api-stream-trisz-hu-cert" {
  source = "./modules/acm"

  domain_name = var.api_domain_name
  zone_id = module.stream-trisz-hu.zone_id
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
    "streamzen-alb-sg" = [
      {
        type      = "ingress"
        cidr      = "0.0.0.0/0"
        from_port = 443
        to_port   = 443
        protocol  = "tcp"
      },
      {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    ]
    "streamzen-private-sg" = [
      {
        type     = "ingress"
        cidr     = "10.10.10.0/24"
        protocol = "-1"
      },
      {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    ]
  }
}

# module "api" {
#   source = "./modules/api-stack"

#   environment         = var.environment
#   domain_zone_id      = module.stream-trisz-hu.zone_id
#   alb_secgroup_ids    = [module.vpc.secgroups["streamzen-alb-sg"]]
#   alb_vpc_id          = module.vpc.vpc_id
#   alb_subnet_ids      = [module.vpc.subnets["streamzen-alb-1a"], module.vpc.subnets["streamzen-alb-1b"]]
#   alb_cert_arn        = aws_acm_certificate.streamzen.arn
#   alb_tg_port_mapping = 80
#   ecs = {
#     health_check = {
#       command = [
#         "CMD-SHELL",
#         "curl -f http://localhost:${var.port_mapping}/_health || exit 1"
#       ]
#       retries     = 3
#       startPeriod = 300
#       interval    = 5
#       timeout     = 5
#     }
#     family_name  = "streamzen-api"
#     port_mapping = "80"
#     task_environment = {
#       "ENVIRONMENT" = var.environment
#     }
#     memory             = 512
#     cpu                = 256
#     image              = "nginx:latest"
#     desired_task_count = 1
#   }
#   api_secgroup_ids = [module.vpc.secgroups["streamzen-private-sg"]]
#   api_subnet_ids   = [module.vpc.subnets["streamzen-private-1a"], module.vpc.subnets["streamzen-private-1b"]]
#   db = {
#     engine         = "postgres"
#     engine_version = "16.4"
#     instance_class = "db.t3.micro"
#   }
# }

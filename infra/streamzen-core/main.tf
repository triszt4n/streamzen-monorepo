module "frontend" {
  source = "./modules/cloudfront-s3-origin"

  environment = var.environment
  domain_name = var.domain_name
  # web_acl_arn     = aws_wafv2_web_acl.global.arn
  alb_domain_name = var.api_domain_name
  alb_api_key     = data.aws_ssm_parameter.api_key.value
  acm_cert_arn    = aws_acm_certificate.streamzen.arn
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

module "vpc" {
  source = "./modules/protected-vpc"

  environment = var.environment
  name = "streamzen-api-vpc"
  cidr = "10.10.10.0/24"
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
        type      = "ingress"
        cidr      = "10.10.10.0/24"
        protocol  = "-1"
      },
      {
        type     = "egress"
        cidr     = "0.0.0.0/0"
        protocol = "-1"
      }
    ]
  }
}

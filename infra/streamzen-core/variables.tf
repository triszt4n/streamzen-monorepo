variable "environment" {
  description = "The environment to deploy the infrastructure to"
  type        = string
}

variable "region" {
  description = "The region to deploy the infrastructure to"
  type        = string
}

variable "domain_name" {
  description = "The domain name to use for the CloudFront distribution"
  type        = string
}

variable "api_domain_name" {
  description = "The domain name to use for the ALB"
  type        = string
}

variable "environment" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "alb_domain_name" {
  type = string
}

variable "web_acl_arn" {
  type    = string
  default = null
}

variable "acm_cert_arn" {
  type = string
}

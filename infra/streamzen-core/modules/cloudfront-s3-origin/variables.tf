variable "environment" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "alb_domain_name" {
  type = string
}

variable "mediapackage_origin_domain_name" {
  type = string
}

variable "web_acl_arn" {
  type    = string
  default = null
}

variable "acm_cert_arn" {
  type = string
}

variable "secret_mediapackage_cdn_identifier" {
  type = string
}

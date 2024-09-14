variable "name" {
  type        = string
  description = "A handy name for the module"
}

variable "domain_name" {
  type        = string
  description = "The domain name to use for the hosted zone"
}

variable "hosted_zone_description" {
  type        = string
  description = "Define what these records are for"
  default     = null
}

variable "delegation_set_refname" {
  type        = string
  description = "Optional reference name for the delegation set"
  default     = null
}

variable "alias_records" {
  type = map(object({
    type = string
    records = list(object({
      name    = string
      zone_id = string
    }))
  }))
  description = "Alias records to create in the hosted zone, map key is the record name"
}

variable "simple_records" {
  type = map(object({
    type    = string
    ttl     = optional(number, 300)
    records = list(string)
  }))
  description = "Non-alias records to create in the hosted zone, map key is the record name"
}

variable "environment" {
  type = string
}

variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "rules" {
  type = object({
    type      = string
    cidr      = string
    from_port = optional(number)
    to_port   = optional(number)
    protocol  = string
  })
}

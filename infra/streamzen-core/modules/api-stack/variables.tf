variable "environment" {
  type = string
}

variable "domain_zone_id" {
  type = string
}

variable "alb_secgroup_ids" {
  type = list(string)
}

variable "alb_vpc_id" {
  type = string
}

variable "alb_subnet_ids" {
  type = list(string)
}

variable "alb_cert_arn" {
  type = string
}

variable "alb_tg_port_mapping" {
  type = number
}

variable "ecs" {
  type = object({
    health_check = string
    family_name  = string
    port_mappings = string
    task_environment = map(string)
    memory = number
    cpu = number
    image = string
    desired_task_count = number
  })
}

variable "api_secgroup_ids" {
  type = list(string)
}

variable "alb_vpc_id" {
  type = string
}

variable "api_subnet_ids" {
  type = list(string)
}

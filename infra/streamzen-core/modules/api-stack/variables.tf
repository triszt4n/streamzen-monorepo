variable "environment" {
  type = string
}

variable "alb_secgroup_ids" {
  type = list(string)
}

variable "vpc_id" {
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
    health_check = object({
      command     = list(string)
      retries     = number
      startPeriod = number
      interval    = number
      timeout     = number
    })
    family_name        = string
    port_mapping       = number
    task_environment   = map(string)
    memory             = number
    cpu                = number
    desired_task_count = number
  })
}

variable "api_secgroup_ids" {
  type = list(string)
}

variable "api_subnet_ids" {
  type = list(string)
}

variable "db" {
  type = object({
    engine            = optional(string, "postgres")
    engine_version    = optional(string, "16.4")
    instance_class    = optional(string, "db.t3.micro")
    allocated_storage = optional(number, 20)
    port              = optional(number, 5432)
  })
}

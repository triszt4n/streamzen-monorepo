variable "function_name" {
  type        = string
  description = "The name of the function without the 'streamzen-' prefix"
}

variable "function_runtime" {
  type    = string
  default = "nodejs20.x"
}

variable "permitted_resources" {
  description = "The resources that can invoke the function"
  type = map(object({
    action                 = string
    source_arn             = string
    principal              = string
    function_url_auth_type = optional(string)
  }))
  default = {}
}

variable "deploy_function_url" {
  description = "Whether to deploy the function URL"
  type        = bool
  default     = false
}

variable "vpc_config" {
  description = "The VPC configuration for the function"
  type = object({
    subnet_ids   = list(string)
    secgroup_ids = list(string)
  })
  default = null
}

variable "function_code" {
  description = "The name of the used file for function in function-codes directory"
  type        = string
}

variable "environment_variables" {
  description = "The environment variables for the function"
  type        = map(string)
  default     = {}
}

variable "timeout" {
  type    = number
  default = 3
}

variable "notifier_bucket_id" {
  description = "The ID of the bucket that notifies the function"
  type        = string
  default     = null
}

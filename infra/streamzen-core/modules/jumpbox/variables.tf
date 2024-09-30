variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "secgroup_id" {
  type = string
}

variable "ami_id" {
  type    = string
  default = "ami-023adaba598e661ac" # ami: amazon/ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-2024030
}

variable "instance_type" {
  type    = string
  default = "t3.nano"
}

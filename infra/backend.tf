terraform {
  backend "s3" {
    bucket  = "streamzen-aws-terraform-state"
    encrypt = true
    key     = "terraform.tfstate"
    region  = "eu-central-1"
  }
}

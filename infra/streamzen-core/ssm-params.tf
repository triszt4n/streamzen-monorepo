locals {
  secrets = [
    "alb-api-key",
    "db-password",
    "db-username",
  ]
}

resource "aws_ssm_parameter" "these" {
  for_each = toset(local.secrets)

  name  = "/streamzen-${var.environment}/${each.value}"
  type  = "SecureString"
  value = "dummyvalue"
  lifecycle {
    ignore_changes = [value]
  }
}

data "aws_ssm_parameter" "api_key" {
  name            = aws_ssm_parameter.these["alb-api-key"].name
  with_decryption = true
}

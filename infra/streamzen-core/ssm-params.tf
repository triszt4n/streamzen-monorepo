resource "aws_ssm_parameter" "api_key" {
  name        = "/streamzen-dev/alb-api-key"
  description = "API Key for the ALB"
  type        = "SecureString"
  value       = "dummyvalue"
  lifecycle {
    ignore_changes = [value]
  }
}

data "aws_ssm_parameter" "api_key" {
  name            = aws_ssm_parameter.api_key.name
  with_decryption = true
}

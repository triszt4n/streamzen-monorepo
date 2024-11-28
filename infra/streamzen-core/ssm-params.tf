locals {
  secrets = [
    "db-password",
    "db-username",
    "api-jwt-secret",
    "authsch-client-secret",
    "authsch-client-id",
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

data "aws_ssm_parameter" "these" {
  for_each = toset(local.secrets)

  name            = aws_ssm_parameter.these[each.key].name
  with_decryption = true
}

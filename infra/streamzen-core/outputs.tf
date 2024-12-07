output "stream-trisz-hu" {
  value = {
    name_servers = module.stream-trisz-hu.name_servers
  }
}

output "secret-arn" {
  value = aws_secretsmanager_secret.cdn_auth.arn
}

output "emp-role-arn" {
  value = aws_iam_role.emp_role.arn
}

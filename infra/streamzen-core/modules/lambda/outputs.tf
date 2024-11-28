data "aws_region" "current" {}

output "origin_domain_name" {
  value = var.deploy_function_url ? "${aws_lambda_function_url.this[0].url_id}.lambda-url.${data.aws_region.current.name}.on.aws" : null
}

output "invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

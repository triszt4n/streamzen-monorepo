resource "aws_cloudfront_function" "request_function" {
  name    = "streamzen-frontend-function-${var.environment}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code = file("${path.module}/function-codes/frontend-request-default.js")
}

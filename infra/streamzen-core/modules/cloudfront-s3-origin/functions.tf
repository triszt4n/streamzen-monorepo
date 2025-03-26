resource "aws_cloudfront_function" "request_function" {
  name    = "streamzen-frontend-function-${var.environment}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/function-codes/frontend-request-default.js")
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudfront_function" "url_rewrite_function" {
  name    = "streamzen-url-rewrite-function-${var.environment}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/function-codes/url-rewrite.js")
  lifecycle {
    create_before_destroy = true
  }
}

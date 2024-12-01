resource "aws_cloudfront_function" "request_function" {
  name    = "streamzen-frontend-function-${var.environment}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/function-codes/frontend-request-default.js")
}

resource "aws_cloudfront_function" "url_rewrite_function" {
  name    = "streamzen-media-assets-function-${var.environment}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/function-codes/media-assets-url-rewrite.js")
}

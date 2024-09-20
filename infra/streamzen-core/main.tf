module "frontend" {
  source = "./modules/cloudfront-s3-origin"

  environment = var.environment
  domain_name = var.domain_name
  # web_acl_arn     = aws_wafv2_web_acl.global.arn
  alb_domain_name = var.api_domain_name
  alb_api_key     = data.aws_ssm_parameter.api_key.value
  acm_cert_arn    = aws_acm_certificate.streamzen.arn
}

module "stream-trisz-hu" {
  source = "./modules/hosted-zone-with-records"

  name                   = "stream-trisz-hu"
  domain_name            = "stream.trisz.hu"
  delegation_set_refname = "streamzen-delegationset-stream-trisz-hu"

  simple_records = {
  }
  alias_records = {
  }
}

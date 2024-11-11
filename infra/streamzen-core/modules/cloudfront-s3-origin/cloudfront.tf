resource "aws_cloudfront_distribution" "frontend" {
  enabled = true
  staging = false
  comment = "streamzen-frontend-distro-${var.environment}"
  aliases = [var.domain_name]

  web_acl_id          = var.web_acl_arn
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
    origin_id                = "frontend-origin"
  }

  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.assets.id
    origin_id                = "assets-origin"
  }

  origin {
    origin_id   = "alb-origin"
    domain_name = var.alb_domain_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
    custom_header {
      name  = "X-Api-Key"
      value = var.alb_api_key
    }
  }

  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = true

  ordered_cache_behavior {
    path_pattern = "/api/*"

    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "alb-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Attached policies
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all.id
  }

  ordered_cache_behavior {
    path_pattern = "/media-assets/*"

    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "assets-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Attached policies
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_no_host.id
  }

  default_cache_behavior {
    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "frontend-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Attached policies
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_no_host.id
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_cert_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }
}

resource "aws_cloudfront_vpc_origin" "alb" {
  vpc_origin_endpoint_config {
    name                   = "vpc-origin"
    arn                    = var.alb_arn
    http_port              = 80
    https_port             = 443
    origin_protocol_policy = "http-only" # terminate SSL at ALB

    origin_ssl_protocols {
      items    = ["TLSv1.2"]
      quantity = 1
    }
  }
}

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
    origin_id   = "live-origin"
    domain_name = var.mediapackage_origin_domain_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-MediaPackage-CDNIdentifier"
      value = var.secret_mediapackage_cdn_identifier
    }
  }

  origin {
    origin_id   = "vpc-origin"
    domain_name = var.alb_domain_name

    vpc_origin_config {
      vpc_origin_id = aws_cloudfront_vpc_origin.alb.id
    }
  }

  lifecycle {
    ignore_changes = [
      origin,
      ordered_cache_behavior[0].target_origin_id
    ]
  }

  http_version        = "http2and3"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = true

  ordered_cache_behavior {
    path_pattern = "/api/*"

    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "vpc-origin"
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
    cache_policy_id            = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_no_host.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite_function.arn
    }
  }

  ordered_cache_behavior {
    path_pattern = "/media-live/*"

    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "live-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Attached policies
    cache_policy_id            = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_no_host.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite_function.arn
    }
  }

  default_cache_behavior {
    allowed_methods        = local.allowed_methods_types.all
    cached_methods         = local.cached_methods_types.get_head
    compress               = true
    target_origin_id       = "frontend-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Attached policies
    cache_policy_id            = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_no_host.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.cors.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.request_function.arn
    }
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

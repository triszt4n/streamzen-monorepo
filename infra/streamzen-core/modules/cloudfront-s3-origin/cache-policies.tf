data "aws_cloudfront_cache_policy" "managed" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

resource "aws_cloudfront_cache_policy" "one_year" {
  name        = "streamzen-one-year-cache-policy"
  default_ttl = 31536000
  max_ttl     = 31536000
  min_ttl     = 31536000
  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

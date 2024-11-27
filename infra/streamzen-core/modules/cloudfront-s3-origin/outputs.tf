output "domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "hosted_zone_id" {
  value = aws_cloudfront_distribution.frontend.hosted_zone_id
}

output "processed_bucket_uri" {
  value = aws_s3_bucket.assets.bucket_regional_domain_name
}

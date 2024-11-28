output "alb_arn" {
  value = aws_lb.this.arn
}

output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "alb_zone_id" {
  value = aws_lb.this.zone_id
}

output "uploaded_bucket_uri" {
  value = aws_s3_bucket.assets.bucket_regional_domain_name
}

output "uploaded_bucket_arn" {
  value = aws_s3_bucket.assets.arn
}

output "uploaded_bucket_id" {
  value = aws_s3_bucket.assets.id
}

module "s3_bucket" {
  for_each = local.s3_buckets_to_create

  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "${each.key}-${local.environment}"
  acl    = try(each.value.acl, "private")

  versioning = {
    enabled = false
  }
}

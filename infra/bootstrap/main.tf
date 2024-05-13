# the s3 bucket to store the state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "streamzen-aws-terraform-state"
}

resource "aws_s3_bucket_versioning" "versioning_example" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

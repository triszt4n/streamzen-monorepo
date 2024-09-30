resource "aws_s3_bucket" "assets" {
  bucket = "streamzen-uploaded-videos-${var.environment}-bucket"
}

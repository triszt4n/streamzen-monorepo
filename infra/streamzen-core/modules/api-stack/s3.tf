resource "aws_s3_bucket" "assets" {
  bucket = "streamzen-uploaded-videos-${var.environment}-bucket"
}

resource "aws_s3_bucket_policy" "access_from_ecs_to_videos" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.allow_access_from_ecs.json
}

data "aws_iam_policy_document" "allow_access_from_ecs" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = [
      "s3:GetObject",
    ]
    resources = [
      "${aws_s3_bucket.frontend.arn}/*",
      "${aws_s3_bucket.assets.arn}/*",
    ]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.frontend.arn]
    }
  }
}

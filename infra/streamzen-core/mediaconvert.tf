data "aws_media_convert_queue" "this" {
  id = "Default"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["mediaconvert.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "emc_policy" {
  statement {
    effect = "Allow"
    actions = [
      "mediaconvert:*",
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "iam:ListRoles",
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "iam:PassRole",
    ]
    resources = ["arn:aws:iam:::role/streamzen-emc-job-role-${var.environment}"]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
      "s3:ListAllMyBuckets",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    resources = [
      "arn:aws:s3:::${module.frontend.processed_bucket_id}",
      "arn:aws:s3:::${module.frontend.processed_bucket_id}/*"
    ]
  }
}

resource "aws_iam_policy" "emc_policy" {
  name   = "streamzen-emc-job-policy-${var.environment}"
  policy = data.aws_iam_policy_document.emc_policy.json
}

resource "aws_iam_role" "emc_role" {
  name               = "streamzen-emc-job-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "emc_policy_attachment" {
  role       = aws_iam_role.emc_role.id
  policy_arn = aws_iam_policy.emc_policy.arn
}

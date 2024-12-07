## SECRET
resource "aws_secretsmanager_secret" "cdn_auth" {
  name = "streamzen-cdn-auth-${var.environment}"
}

resource "aws_secretsmanager_secret_version" "cdn_auth" {
  secret_id     = aws_secretsmanager_secret.cdn_auth.id
  secret_string = jsonencode({ "MediaPackageCDNIdentifier" = "dummyvalue" })
  lifecycle {
    ignore_changes = [secret_string]
  }
}

## IAM COMPONENTS
data "aws_iam_policy_document" "assume_role_emp" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["mediapackage.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "emp_policy" {
  statement {
    effect = "Allow"
    actions = [
      "iam:GetRole",
         "iam:PassRole",
    ]
    resources = [
      "${aws_iam_role.emp_role.arn}",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecrets",
        "secretsmanager:ListSecretVersionIds",
    ]
    resources = [
      "${aws_secretsmanager_secret.cdn_auth.arn}",
    ]
  }
}

resource "aws_iam_policy" "emp_policy" {
  name   = "streamzen-mediapackage-secrets-policy-${var.environment}"
  policy = data.aws_iam_policy_document.emp_policy.json
}

resource "aws_iam_role" "emp_role" {
  name               = "streamzen-mediapackage-secrets-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_emp.json
}

resource "aws_iam_role_policy_attachment" "emp_policy_attachment" {
  role       = aws_iam_role.emp_role.id
  policy_arn = aws_iam_policy.emp_policy.arn
}

## MEDIAPACKAGE COMPONENTS
resource "aws_media_package_channel" "this" {
  channel_id = "streamzen-mediapackage-channel-dev"
}

## MediaPackage Channel Origin Endpoints are not managed from Terraform (yet),
## as there are no Terraform resources available for managing them.
## The following Origin Endpoints are created manually in the AWS Console:

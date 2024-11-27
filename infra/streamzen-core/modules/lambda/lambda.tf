data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "logging_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = ["arn:aws:s3:::${coalesce(var.notifier_bucket_id, "none")}/*"]
  }
}

data "aws_iam_policy_document" "network_policy" {
  statement {
    effect = "Allow"
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DeleteNetworkInterface",
      "ec2:AssignPrivateIpAddresses",
      "ec2:UnassignPrivateIpAddresses",
    ]
    resources = ["arn:aws:ec2:*:*:*/*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeVpcs",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "function_logging_policy" {
  name   = "streamzen-${var.function_name}-logpolicy"
  policy = data.aws_iam_policy_document.logging_policy.json
}

resource "aws_iam_policy" "function_s3_policy" {
  count  = var.notifier_bucket_id != null ? 1 : 0
  name   = "streamzen-${var.function_name}-s3policy"
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_iam_policy" "function_network_policy" {
  count  = var.vpc_config != null ? 1 : 0
  name   = "streamzen-${var.function_name}-networkpolicy"
  policy = data.aws_iam_policy_document.network_policy.json
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "streamzen-${var.function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "function_logging_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.function_logging_policy.arn
}

resource "aws_iam_role_policy_attachment" "function_s3_policy_attachment" {
  count      = var.notifier_bucket_id != null ? 1 : 0
  role       = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.function_s3_policy[0].arn
}

resource "aws_iam_role_policy_attachment" "function_network_policy_attachment" {
  count      = var.vpc_config != null ? 1 : 0
  role       = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.function_network_policy[0].arn
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  #checkov:skip=CKV_AWS_338: Ensure CloudWatch log groups retains logs for at least 1 year
  name              = "/aws/lambda/streamzen-${var.function_name}"
  retention_in_days = 7
  lifecycle {
    prevent_destroy = false
  }
}

data "archive_file" "lambda" {
  type        = "zip"
  output_path = "/tmp/streamzen-uploadables/${var.function_name}.zip"
  source {
    content  = file("${path.module}/function-codes/${var.function_code}")
    filename = "index.mjs"
  }
}

resource "aws_lambda_function" "this" {
  #checkov:skip=CKV_AWS_272: Ensure AWS Lambda function is configured to validate code-signing
  filename      = data.archive_file.lambda.output_path
  function_name = "streamzen-${var.function_name}"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"
  runtime       = var.function_runtime
  timeout       = var.timeout

  source_code_hash = data.archive_file.lambda.output_base64sha256
  depends_on       = [aws_cloudwatch_log_group.lambda_log_group]

  dynamic "vpc_config" {
    for_each = var.vpc_config != null ? [1] : []
    content {
      subnet_ids         = var.vpc_config.subnet_ids
      security_group_ids = var.vpc_config.secgroup_ids
    }
  }

  dynamic "environment" {
    for_each = length(var.environment_variables) > 0 ? [1] : []
    content {
      variables = var.environment_variables
    }
  }
}

resource "aws_lambda_function_url" "this" {
  count = var.deploy_function_url ? 1 : 0

  function_name      = aws_lambda_function.this.function_name
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "this" {
  for_each = var.permitted_resources

  action                 = each.value.action
  function_name          = aws_lambda_function.this.function_name
  function_url_auth_type = try(each.value.function_url_auth_type, null)
  principal              = each.value.principal
  source_arn             = each.value.source_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  count = var.notifier_bucket_id != null ? 1 : 0

  bucket = var.notifier_bucket_id

  lambda_function {
    lambda_function_arn = aws_lambda_function.this.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.this]
}

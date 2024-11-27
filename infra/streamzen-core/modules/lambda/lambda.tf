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
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "function_logging_policy" {
  name   = "streamzen-${var.function_name}-logpolicy"
  policy = data.aws_iam_policy_document.logging_policy.json
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "streamzen-${var.function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "function_logging_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.function_logging_policy.arn
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
    content = length(var.template_inputs) > 0 ? templatefile(
      "${path.module}/function-codes/${var.function_code}",
      var.template_inputs
      ) : file(
      "${path.module}/function-codes/${var.function_code}"
    )
    filename = "index.js"
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

  dynamic vpc_config {
    for_each = var.vpc_config != null ? [1] : []
    content {
      subnet_ids = var.vpc_config.subnet_ids
    security_group_ids = var.vpc_config.secgroup_ids
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

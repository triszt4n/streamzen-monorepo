# FUNCTIONS ------------------------------------------------------------
module "job_starter" {
  source = "./modules/lambda"

  function_name = "job-starter-${var.environment}"
  function_code = "job-starter.js"
  timeout       = 60

  vpc_config = {
    subnet_ids = [
      module.vpc.subnets["streamzen-lambda-1a"].id,
      module.vpc.subnets["streamzen-lambda-1b"].id,
    ]
    secgroup_ids = [
      module.vpc.secgroups["streamzen-lambda-sg"].id,
    ]
  }

  environment_variables = {
    MEDIACONVERT_ENDPOINT = "https://6qbvwvyqc.mediaconvert.eu-central-1.amazonaws.com"
    JOB_QUEUE_ARN         = data.aws_media_convert_queue.this.arn
    IAM_ROLE_ARN          = aws_iam_role.emc_role.arn
    OUTPUT_BUCKET_URI     = "s3://${module.frontend.processed_bucket_id}"
    INPUT_BUCKET_URI      = "s3://${module.api.uploaded_bucket_id}"
    ENVIRONMENT_NAME      = var.environment
  }

  permitted_resources = {
    s3 = {
      action     = "lambda:InvokeFunction"
      principal  = "s3.amazonaws.com"
      source_arn = module.api.uploaded_bucket_arn
    }
  }
  notifier_bucket_id = module.api.uploaded_bucket_id
}

module "job_finalizer" {
  source = "./modules/lambda"

  function_name = "job-finalizer-${var.environment}"
  function_code = "job-finalizer.js"
  timeout       = 30

  vpc_config = {
    subnet_ids = [
      module.vpc.subnets["streamzen-lambda-1a"].id,
      module.vpc.subnets["streamzen-lambda-1b"].id,
    ]
    secgroup_ids = [
      module.vpc.secgroups["streamzen-lambda-sg"].id,
    ]
  }

  environment_variables = {
    BACKEND_API_URL = "http://${module.api.alb_dns_name}/api"
  }

  permitted_resources = {
    eventbridge = {
      action     = "lambda:InvokeFunction"
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.this.arn
    }
  }
}

module "live_ready" {
  source = "./modules/lambda"

  function_name = "live-ready-${var.environment}"
  function_code = "live-ready.js"
  timeout       = 30

  vpc_config = {
    subnet_ids = [
      module.vpc.subnets["streamzen-lambda-1a"].id,
      module.vpc.subnets["streamzen-lambda-1b"].id,
    ]
    secgroup_ids = [
      module.vpc.secgroups["streamzen-lambda-sg"].id,
    ]
  }

  permitted_resources = {
    eventbridge = {
      action     = "lambda:InvokeFunction"
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.this.arn
    }
  }
}

# IAM COMPONENTS ------------------------------------------------------------
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
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups",
    ]
    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:ListAllMyBuckets",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    resources = [
      "arn:aws:s3:::${module.api.uploaded_bucket_id}",
      "arn:aws:s3:::${module.api.uploaded_bucket_id}/*",
      "arn:aws:s3:::${module.frontend.processed_bucket_id}",
      "arn:aws:s3:::${module.frontend.processed_bucket_id}/*",
    ]
  }
}

data "aws_iam_policy_document" "lambda_emc_policy" {
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
    resources = [aws_iam_role.emc_role.arn]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:ListAllMyBuckets",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    resources = [
      "arn:aws:s3:::${module.api.uploaded_bucket_id}",
      "arn:aws:s3:::${module.api.uploaded_bucket_id}/*",
      "arn:aws:s3:::${module.frontend.processed_bucket_id}",
      "arn:aws:s3:::${module.frontend.processed_bucket_id}/*",
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

resource "aws_iam_policy" "lambda_emc_policy" {
  name   = "streamzen-job-starter-${var.environment}-emcpolicy"
  policy = data.aws_iam_policy_document.lambda_emc_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_emc_policy_attachment" {
  role       = module.job_starter.role_id
  policy_arn = aws_iam_policy.lambda_emc_policy.arn
}

# EVENTBRIDGE COMPONENTS ------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "this" {
  name        = "streamzen-mediaconvert-event-rule-${var.environment}"
  description = "Capture MediaConvert job state changes"

  event_pattern = jsonencode({
    source      = ["aws.mediaconvert"],
    detail-type = ["MediaConvert Job State Change"]
    detail = {
      status = [
        "COMPLETE",
        "ERROR",
        "STATUS_UPDATE",
      ]
      userMetadata = {
        application = ["streamzen-${var.environment}"]
      }
    }
  })
}

resource "aws_cloudwatch_event_target" "this" {
  rule      = aws_cloudwatch_event_rule.this.name
  target_id = "streamzen-mediaconvert-event-target-${var.environment}"
  arn       = module.job_finalizer.arn
}

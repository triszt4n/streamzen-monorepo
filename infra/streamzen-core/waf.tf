resource "aws_wafv2_web_acl" "global" {
  provider = aws.global
  name     = "streamzen-global-webacl-${var.environment}"
  scope    = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "streamzen-global-webacl-${var.environment}-KnownBadInputs"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "streamzen-global-webacl-${var.environment}"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_web_acl" "regional" {
  name  = "streamzen-regional-webacl-${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "CheckAPIKey"
    priority = 1

    action {
      block {}
    }

    statement {
      not_statement {
        statement {
          byte_match_statement {
            field_to_match {
              single_header {
                name = "x-streamzen-api-key"
              }
            }
            positional_constraint = "EXACTLY"
            search_string         = data.aws_ssm_parameter.these["alb-api-key"].value
            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "CheckAPIKey-metric"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "streamzen-regional-webacl-${var.environment}-KnownBadInputs"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "streamzen-regional-webacl-${var.environment}"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = module.api.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.regional.arn
}

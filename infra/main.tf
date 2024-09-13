module "s3_bucket" {
  for_each = local.s3_buckets_to_create

  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "${each.key}-${local.environment}"
  acl    = try(each.value.acl, "private")

  versioning = {
    enabled = false
  }
}

module "api_gateway_acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 4.0"

  domain_name               = local.backend_config.api_gateway.domain
  subject_alternative_names = ["*.${local.backend_config.api_gateway.domain}"]

  zone_id             = "Z2ES7B9AZ6SHAE"
  validation_method   = "DNS"
  wait_for_validation = true
}

module "api_gateway" {
  source        = "terraform-aws-modules/apigateway-v2/aws"
  name          = local.backend_config.api_gateway.name
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = [local.frontend_config.amplify_app.domain]
  }

  # Custom domain
  domain_name                 = local.backend_config.api_gateway.domain
  domain_name_certificate_arn = module.api_gateway_acm.certificate_arn



  # Access logs
  default_stage_access_log_destination_arn = "arn:aws:logs:eu-west-1:835367859851:log-group:debug-apigateway"
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
    "POST /" = {
      lambda_arn             = "arn:aws:lambda:eu-west-1:052235179155:function:my-function"
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
    }

    "GET /some-route-with-authorizer" = {
      integration_type = "HTTP_PROXY"
      integration_uri  = "some url"
      authorizer_key   = "azure"
    }

    "$default" = {
      lambda_arn = "arn:aws:lambda:eu-west-1:052235179155:function:my-default-function"
    }
  }

  authorizers = {
    "azure" = {
      authorizer_type  = "JWT"
      identity_sources = "$request.header.Authorization"
      name             = "azure-auth"
      audience         = ["d6a38afd-45d6-4874-d1aa-3c5c558aqcc2"]
      issuer           = "https://sts.windows.net/aaee026e-8f37-410e-8869-72d9154873e4/"
    }
  }

  tags = {
    Name = "http-apigateway"
  }
}

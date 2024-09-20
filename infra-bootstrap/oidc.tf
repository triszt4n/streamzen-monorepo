locals {
  managed_policies_to_attach = [
    "AdministratorAccess"
  ]
  authorized_repositories = [
    "repo:triszt4n/streamzen-monorepo:*"
  ]
}

resource "aws_iam_openid_connect_provider" "github" {
  client_id_list = [
    "https://github.com/triszt4n",
    "sts.amazonaws.com",
  ]

  # https://github.blog/changelog/2023-06-27-github-actions-update-on-oidc-integration-with-aws/
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
  url = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "github_oidc_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "ForAllValues:StringEquals"
      variable = "token.actions.githubusercontent.com:iss"
      values   = ["https://token.actions.githubusercontent.com"]
    }
    condition {
      test     = "ForAnyValue:StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.authorized_repositories
    }
  }
}

resource "aws_iam_role" "github_oidc_pipeline" {
  assume_role_policy   = data.aws_iam_policy_document.github_oidc_assume_role.json
  description          = "Role assumed by the GitHub OIDC provider on pipelines."
  max_session_duration = 3600 # Maximum 60 minutes
  name                 = "github-oidc-pipeline"
}

data "aws_iam_policy" "managed_policies" {
  for_each = toset(local.managed_policies_to_attach)
  arn      = "arn:aws:iam::aws:policy/${each.value}"
}

resource "aws_iam_role_policy_attachment" "github_oidc_managed_policies" {
  for_each   = toset(local.managed_policies_to_attach)
  role       = aws_iam_role.github_oidc_pipeline.id
  policy_arn = data.aws_iam_policy.managed_policies[each.value].arn
}

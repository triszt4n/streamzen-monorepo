resource "aws_ecr_repository" "this" {
  name                 = "streamzen-api-repo-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_repository_policy" "scraper-app_repository_policy" {
  repository = aws_ecr_repository.service_repository.name
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "admin-${aws_ecr_repository.service_repository.name}",
        Effect = "Allow",
        Principal = {
          Service = "codebuild.amazonaws.com",
          AWS = [
            var.ecstd_task_role_arn,
            var.ecstd_task_execution_role_arn,
          ]
        },
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories",
          "ecr:GetRepositoryPolicy",
          "ecr:ListImages",
          "ecr:DeleteRepository",
          "ecr:BatchDeleteImage",
          "ecr:SetRepositoryPolicy",
          "ecr:DeleteRepositoryPolicy",
        ]
      }
    ]
  })
}

resource "aws_ecr_lifecycle_policy" "main" {
  repository = aws_ecr_repository.service_repository.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "keep last 20 images"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 20
      }
    }]
  })
}

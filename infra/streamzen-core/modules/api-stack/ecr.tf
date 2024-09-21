resource "aws_ecr_repository" "this" {
  name                 = "streamzen-api-repo-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_repository_policy" "this" {
  repository = aws_ecr_repository.this.name
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "admin-${aws_ecr_repository.this.name}",
        Effect = "Allow",
        Principal = {
          Service = "codebuild.amazonaws.com",
          AWS = [
            aws_iam_role.ecs_service.arn,
            aws_iam_role.ecs_service_install.arn
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

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name

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

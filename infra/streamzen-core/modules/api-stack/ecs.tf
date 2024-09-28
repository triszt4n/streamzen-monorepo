locals {
  port_mappings = [
    {
      containerPort = var.ecs.port_mapping
      hostPort      = var.ecs.port_mapping
      protocol      = "tcp"
    }
  ]
}

data "aws_region" "current" {}

resource "aws_ecs_cluster" "this" {
  name = "streamzen-api-cluster-${var.environment}"
}

resource "aws_ecs_task_definition" "this" {
  family = var.ecs.family_name

  container_definitions = jsonencode([
    {
      # volumes  = [
      #   {
      #     name = "streamzen-s3-volume",
      #     host = {
      #       sourcePath = "/mtn/streamzen-s3-volume"
      #     }
      #     dockerVolumeConfiguration = {
      #       driver        = "s3fs"
      #       options    = {
      #         s3Url = "https://s3.amazonaws.com/${aws_s3_bucket.assets.bucket}"
      #   }
      # ]
      # mountPoints  = [
      #   {
      #     sourceVolume  = "streamzen-s3-volume"
      #     containerPath = "/data"
      #     readOnly      = false
      #   }
      # ]
      healthCheck  = var.ecs.health_check
      portMappings = local.port_mappings
      environment = [for k, v in var.ecs.task_environment : {
        name  = k
        value = v
      }]
      memory    = var.ecs.memory,
      cpu       = var.ecs.cpu,
      image     = var.ecs.image,
      essential = true,
      name      = "streamzen-api-${var.environment}",
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "ecs-streamzen-api-${var.environment}"
        }
      }
    }
  ])

  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = var.ecs.memory
  cpu                      = var.ecs.cpu
  execution_role_arn       = aws_iam_role.ecs_service_install.arn
  task_role_arn            = aws_iam_role.ecs_service.arn
}

resource "aws_ecs_service" "this" {
  name                              = "streamzen-api-service-${var.environment}"
  cluster                           = aws_ecs_cluster.this.arn
  task_definition                   = aws_ecs_task_definition.this.arn
  desired_count                     = var.ecs.desired_task_count
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 300

  network_configuration {
    subnets          = var.api_subnet_ids
    security_groups  = var.api_secgroup_ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.this.arn
    container_name   = "streamzen-api-${var.environment}"
    container_port   = var.ecs.port_mapping
  }
}

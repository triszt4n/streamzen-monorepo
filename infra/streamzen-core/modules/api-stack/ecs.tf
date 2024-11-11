locals {
  port_mappings = [
    {
      containerPort = var.ecs.port_mapping
      hostPort      = var.ecs.port_mapping
      protocol      = "tcp"
    }
  ]

  # bump this if the task definition changes
  image_tag = "streamzen-dummy-image-tag:3"
}

data "aws_region" "current" {}

resource "aws_ecs_cluster" "this" {
  name = "streamzen-api-cluster-${var.environment}"
  tags = {
    local_image_tag = local.image_tag
  }
}

resource "aws_ecs_task_definition" "this" {
  family = var.ecs.family_name

  container_definitions = jsonencode([
    {
      volumes      = []
      mountPoints  = []
      healthCheck  = var.ecs.health_check
      portMappings = local.port_mappings
      environment = concat(
        [for k, v in var.ecs.task_environment : {
          name  = k
          value = v
        }],
        [{
          name = "POSTGRES_PRISMA_URL"
          value = join("", [
            "postgresql://",
            "${var.ecs.task_environment["POSTGRES_USER"]}:",
            "${var.ecs.task_environment["POSTGRES_PASSWORD"]}@",
            "${aws_db_instance.this.endpoint}/",
            "${var.ecs.task_environment["POSTGRES_DB"]}?schema=public",
          ])
        }]
      )
      memory    = var.ecs.memory,
      cpu       = var.ecs.cpu,
      image     = "${aws_ecr_repository.this.repository_url}:latest",
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

  lifecycle {
    replace_triggered_by = [aws_ecs_cluster.this] # this makes it a clusterfuck
    ignore_changes       = [container_definitions]
  }
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
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = "streamzen-api-${var.environment}"
    container_port   = var.ecs.port_mapping
  }
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = var.vpc_id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = var.api_subnet_route_table_ids
  policy            = data.aws_iam_policy_document.vpce_ecs_service_s3.json
}

resource "aws_vpc_endpoint" "ecr_dkr_endpoint" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids  = var.api_secgroup_ids
  subnet_ids          = var.api_subnet_ids
}

resource "aws_vpc_endpoint" "ecr_api_endpoint" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids  = var.api_secgroup_ids
  subnet_ids          = var.api_subnet_ids
}

# resource "aws_vpc_endpoint" "ecs_agent" {
#   vpc_id              = var.vpc_id
#   service_name        = "com.amazonaws.${data.aws_region.current.name}.ecs-agent"
#   vpc_endpoint_type   = "Interface"
#   private_dns_enabled = true
#   security_group_ids  = var.api_secgroup_ids
#   subnet_ids          = var.api_subnet_ids
# }

# resource "aws_vpc_endpoint" "ecs_telemetry" {
#   vpc_id              = var.vpc_id
#   service_name        = "com.amazonaws.${data.aws_region.current.name}.ecs-telemetry"
#   vpc_endpoint_type   = "Interface"
#   private_dns_enabled = true
#   security_group_ids  = var.api_secgroup_ids
#   subnet_ids          = var.api_subnet_ids
# }

resource "aws_vpc_endpoint" "ecs_logs" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids  = var.api_secgroup_ids
  subnet_ids          = var.api_subnet_ids
}

data "aws_region" "current" {}

resource "aws_ecs_cluster" "this" {
  name = "streamzen-api-cluster-${var.environment}"
}

resource "aws_ecs_task_definition" "this" {
  family = var.ecs.family_name

  container_definitions = jsonencode([
    {
      volumesFrom  = []
      mountPoints  = []
      healthCheck  = var.ecs.health_check
      portMappings = var.ecs.port_mappings,
      environment = [for k, v in var.ecs.task_environment : {
        name  = k
        value = v
      }]
      memory    = var.ecs.memory,
      cpu       = var.ecs.cpu,
      image     = var.ecs.image,
      essential = true,
      name      = var.microservice_name,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "ecs-${var.microservice_name}"
        }
      }
    }
  ])

  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = var.ecs.memory
  cpu                      = var.ecs.cpu
  execution_role_arn       = var.ecstd_task_execution_role_arn
  task_role_arn            = var.ecstd_task_role_arn
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
    container_name   = var.load_balancer_container_name
    container_port   = var.load_balancer_port
  }
}

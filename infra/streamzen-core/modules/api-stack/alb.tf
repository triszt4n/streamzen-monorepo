resource "aws_lb" "this" {
  # checkov:skip=CKV_AWS_150: Ensure that Load Balancer has deletion protection enabled
  # checkov:skip=CKV_AWS_91: Ensure the ELBv2 (Application/Network) has access logging enabled
  name               = "streamzen-api-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.alb_secgroup_ids
  subnets            = var.alb_subnet_ids

  drop_invalid_header_fields = true
  enable_deletion_protection = false # intentionally set to false
}

resource "aws_lb_target_group" "this" {
  name        = "streamzen-api-alb-tg-${var.environment}"
  port        = var.alb_tg_port_mapping
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200,204"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "2"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

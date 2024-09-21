resource "aws_lb" "this" {
  name               = "streamzen-api-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.alb_secgroup_ids
  subnets            = var.alb_subnet_ids

  enable_deletion_protection = false
}

resource "aws_alb_target_group" "this" {
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
    path                = "/api/health"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_lb.this.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_lb.this.id
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = var.alb_cert_arn

  default_action {
    target_group_arn = aws_alb_target_group.this.id
    type             = "forward"
  }
}

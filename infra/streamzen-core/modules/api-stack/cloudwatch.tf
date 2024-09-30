resource "aws_cloudwatch_log_group" "this" {
  name              = "streamzen-${var.environment}/ecs/api-logs"
  retention_in_days = 7
}

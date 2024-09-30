output "instance_id" {
  value       = aws_instance.this.id
  description = "Instance id of the created jumpbox instance."
}
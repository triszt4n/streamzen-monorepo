output "name_servers" {
  value = aws_route53_zone.this.name_servers
}

output "zone_id" {
  value = aws_route53_zone.this.zone_id
}

output "delegation_set_id" {
  value = aws_route53_delegation_set.this.id
}

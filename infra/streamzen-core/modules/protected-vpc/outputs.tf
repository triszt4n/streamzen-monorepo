output "vpc_arn" {
  value = aws_vpc.this.arn
}

output "vpc_id" {
  value = aws_vpc.this.id
}

output "subnets" {
  value = { for s in aws_subnet.these : s.tags.Name => {
    id : s.id,
    arn : s.arn,
    route_table_id : aws_route_table.these[s.tags.Name].id
  } }
}

output "secgroups" {
  value = { for s in module.secgroups : s.name => {
    id : s.id,
    arn : s.arn,
  } }
}

output "vpc_default_route_table_id" {
  value = aws_vpc.this.default_route_table_id
}

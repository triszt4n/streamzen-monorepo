resource "aws_route53_delegation_set" "this" {
  reference_name = var.delegation_set_refname
}

resource "aws_route53_zone" "this" {
  name              = var.domain_name
  comment           = try(var.hosted_zone_description, "Managed by Terraform")
  delegation_set_id = aws_route53_delegation_set.this.id
}

resource "aws_route53_record" "simple_records" {
  for_each = var.simple_records

  zone_id = aws_route53_zone.this.zone_id
  name    = each.key
  type    = each.value.type
  ttl     = each.value.ttl
  records = each.value.records
}

resource "aws_route53_record" "alias_records" {
  for_each = var.alias_records

  zone_id = aws_route53_zone.this.zone_id
  name    = each.key
  type    = each.value.type

  dynamic "alias" {
    for_each = each.value.records
    content {
      name                   = alias.value.name
      zone_id                = alias.value.zone_id
      evaluate_target_health = true
    }
  }
}

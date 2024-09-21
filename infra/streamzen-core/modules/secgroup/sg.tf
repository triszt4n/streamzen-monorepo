resource "aws_security_group" "this" {
  name        = "${var.name}-${var.environment}"
  description = "${var.name}-${var.environment}"
  vpc_id      = var.vpc_id
  tags = {
    Name = "${var.name}-${var.environment}"
  }
}

resource "aws_vpc_security_group_ingress_rule" "these" {
  for_each = { for rule in var.rules : k => v if v.type == "ingress" }

  security_group_id = aws_security_group.this.id
  cidr_ipv4         = each.value.cidr
  from_port         = each.value.from_port
  ip_protocol       = each.value.protocol
  to_port           = each.value.to_port
}

resource "aws_vpc_security_group_egress_rule" "these" {
  for_each = { for rule in var.rules : k => v if v.type == "egress" }

  security_group_id = aws_security_group.this.id
  cidr_ipv4         = each.value.cidr
  from_port         = each.value.from_port
  ip_protocol       = each.value.protocol
  to_port           = each.value.to_port
}

resource "aws_route53_record" "alb_domain_registration" {
  name            = var.domain_config.domain
  zone_id         = var.domain_zone_id
  type            = "A"
  allow_overwrite = true
  alias {
    name                   = "dualstack.${aws_lb.main.dns_name}"
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "alb_www_domain_registration" {
  name            = "www.${var.domain_config.domain}"
  zone_id         = var.domain_zone_id
  type            = "A"
  allow_overwrite = true
  alias {
    name                   = "dualstack.${aws_lb.main.dns_name}"
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = false
  }
}

output "stream-trisz-hu" {
  value = {
    name_servers = module.stream-trisz-hu.name_servers
  }
}

output "alb" {
  value = module.api.alb_dns_name
}

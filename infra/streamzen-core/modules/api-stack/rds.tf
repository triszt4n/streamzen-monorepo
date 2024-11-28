data "aws_ssm_parameter" "db_username" {
  name            = "/streamzen-dev/db-username"
  with_decryption = true
}

data "aws_ssm_parameter" "db_password" {
  name            = "/streamzen-dev/db-password"
  with_decryption = true
}

resource "aws_db_subnet_group" "this" {
  name       = "streamzen-rds-subnet-group-${var.environment}"
  subnet_ids = var.db_subnet_ids
}

resource "aws_db_instance" "this" {
  identifier = "streamzen-rds-db-${var.environment}"

  allocated_storage = var.db.allocated_storage
  engine            = var.db.engine
  engine_version    = var.db.engine_version
  instance_class    = var.db.instance_class

  db_name  = "streamzen"
  username = data.aws_ssm_parameter.db_username.value
  password = data.aws_ssm_parameter.db_password.value
  port     = var.db.port

  vpc_security_group_ids = var.db_secgroup_ids
  db_subnet_group_name   = aws_db_subnet_group.this.name

  skip_final_snapshot = true
}

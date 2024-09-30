resource "aws_instance" "this" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = [var.secgroup_id]
  subnet_id              = var.subnet_id
  iam_instance_profile   = aws_iam_instance_profile.this.id

  root_block_device {
    volume_size = 10
  }
  tags = {
    Name = var.name
  }
}

resource "aws_iam_instance_profile" "this" {
  name = "${var.name}-jumpbox-profile"
  role = aws_iam_role.this.id
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "this" {
  name               = "${var.name}-jumpbox-role"
  assume_role_policy = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy_attachment" "this" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.this.id
}

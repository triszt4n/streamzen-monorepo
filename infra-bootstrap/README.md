# Bootstrap terraform state

The main.tf file contains resources for bootstrapping the terraform state management.
It does not provision a state lock table in Dynamo yet, as it's only me that uses the terraform client solely.

Running `terraform apply` for this is not necessary as it has already been set up.

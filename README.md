# streamzen-monorepo

Master thesis project aiming to demonstrate a high level knowledge in Cloud Engineering and Software Development. The project realizes a video streaming SaaS service via AWS cloud resources.

##  Manage Terraform resources

Read [README.md](./infra-bootstrap/README.md) in the infra-bootstrap for further infos how you can start up a Terraform backend for the main infrastructure.

1. Log in to your own [AWS access portal](https://trisztanpiller.awsapps.com/start).
2. At `streamzen-account-dev` account you can use the `AdministratorAccess` permission set's Access Keys in the command line to manage the Terraform commands locally.

We use Terragrunt in this repository for easier Terraform management. The `infra` folder is handled as a Terragrunt root module (see in `terragrunt.hcl`).

You can run `terragrunt plan` in the root folder to check for drift.

Run `terragrunt apply` if you want to apply changes to the infra.

## Develop server and client apps

###  Server app

todo

####  Deployment process of the server app

todo

###  Client app

todo

#### Deployment process of the server app

todo

## Others

todo

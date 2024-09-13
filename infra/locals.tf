locals {
  region      = "eu-central-1"
  environment = "dev"

  s3_buckets_to_create = {
    streamzen-uploaded-videos  = {} # You can give more options here
    streamzen-processed-videos = {}
    streamzen-thumbnails       = {}
  }
  backend_config = {
    api_gateway = {
      name = "streamzen-api-gw"
      domain = "api.stream.trisz.hu"
    }
  }
  frontend_config = {
    amplify_app = {
      name = "streamzen-amplify-app"
      domain = "stream.trisz.hu"
    }
  }

  # You can switch off the modules you don't want to run
  do_run_db  = true
  do_run_ecs = true
}

locals {
  region      = "eu-central-1"
  environment = "dev"

  s3_buckets_to_create = {
    "streamzen-uploaded-videos"  = {} # You can give more options here
    "streamzen-processed-videos" = {}
    "streamzen-thumbnails"       = {}
  }

  # You can switch off the modules you don't want to run
  do_run_db  = true
  do_run_ecs = true
}

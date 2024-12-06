## MEDIA LIVE COMPONENTS -----------------------------------------------------
resource "aws_medialive_input_security_group" "this" {
  whitelist_rules {
    cidr = "152.66.0.0/16" # Schönherz IP range
  }
  # whitelist_rules {
  #   cidr = "0.0.0.0/0" # Public IP range
  # }

  tags = {
    secgroup_name = "streamzen-medialive-secgroup-dev"
  }
}

resource "aws_medialive_input" "this" {
  name                  = "streamzen-medialive-input-dev"
  input_security_groups = [aws_medialive_input_security_group.this.id]
  type                  = "RTMP_PUSH"

  destinations {
    stream_name = "streamzen-dev"
  }
}

resource "aws_medialive_channel" "this" {
  name          = "streamzen-medialive-channel-dev"
  channel_class = "SINGLE_PIPELINE"
  role_arn      = aws_iam_role.medialive_role.arn

  input_specification {
    codec            = "AVC"
    input_resolution = "HD"
    maximum_bitrate  = "MAX_20_MBPS"
  }

  input_attachments {
    input_attachment_name = "streamzen-medialive-input-attachment-dev"
    input_id              = aws_medialive_input.this.id

    input_settings {
      deblock_filter            = "DISABLED"
      denoise_filter            = "DISABLED"
      filter_strength           = 1
      input_filter              = "AUTO"
      scte35_pid                = 0
      smpte2038_data_preference = "IGNORE"
      source_end_behavior       = "CONTINUE"
    }
  }

  destinations {
    id = "streamzen-medialive-mediapackage"
    media_package_settings {
      channel_id = aws_media_package_channel.this.channel_id
    }
  }

  encoder_settings {
    timecode_config {
      source = "EMBEDDED"
    }

    # AUDIO FOR 1080p
    audio_descriptions {
      audio_selector_name   = "default"
      audio_type_control    = "FOLLOW_INPUT"
      language_code_control = "FOLLOW_INPUT"
      name                  = "audio_3_aac128"

      codec_settings {
        aac_settings {
          bitrate           = 128000
          coding_mode       = "CODING_MODE_2_0"
          input_type        = "NORMAL"
          profile           = "LC"
          rate_control_mode = "CBR"
          raw_format        = "NONE"
          sample_rate       = 48000
          spec              = "MPEG4"
        }
      }
    }
    # AUDIO FOR 720p
    audio_descriptions {
      audio_selector_name   = "default"
      audio_type_control    = "FOLLOW_INPUT"
      language_code_control = "FOLLOW_INPUT"
      name                  = "audio_3_aac96"

      codec_settings {
        aac_settings {
          bitrate           = 96000
          coding_mode       = "CODING_MODE_2_0"
          input_type        = "NORMAL"
          profile           = "LC"
          rate_control_mode = "CBR"
          raw_format        = "NONE"
          sample_rate       = 48000
          spec              = "MPEG4"
        }
      }
    }
    # VIDEO 720p
    video_descriptions {
      name             = "video_1280_720"
      respond_to_afd   = "NONE"
      scaling_behavior = "DEFAULT"
      sharpness        = 50
      height           = 720
      width            = 1280

      codec_settings {
        h264_settings {
          adaptive_quantization   = "HIGH"
          afd_signaling           = "NONE"
          bitrate                 = 3300000
          buf_fill_pct            = 0
          buf_size                = 0
          color_metadata          = "INSERT"
          entropy_encoding        = "CABAC"
          flicker_aq              = "ENABLED"
          force_field_pictures    = "DISABLED"
          framerate_control       = "SPECIFIED"
          framerate_denominator   = 1001
          framerate_numerator     = 30000
          gop_b_reference         = "ENABLED"
          gop_closed_cadence      = 1
          gop_num_b_frames        = 3
          gop_size                = 60
          gop_size_units          = "FRAMES"
          level                   = "H264_LEVEL_4_1"
          look_ahead_rate_control = "HIGH"
          max_bitrate             = 0
          min_i_interval          = 0
          num_ref_frames          = 1
          par_control             = "SPECIFIED"
          par_denominator         = 0
          par_numerator           = 0
          profile                 = "HIGH"
          qvbr_quality_level      = 0
          rate_control_mode       = "CBR"
          scan_type               = "PROGRESSIVE"
          scene_change_detect     = "ENABLED"
          slices                  = 0
          softness                = 0
          spatial_aq              = "ENABLED"
          subgop_length           = "FIXED"
          syntax                  = "DEFAULT"
          temporal_aq             = "ENABLED"
          timecode_insertion      = "DISABLED"
        }
      }
    }
    # VIDEO 1080p
    video_descriptions {
      name             = "video_1920_1080"
      respond_to_afd   = "NONE"
      scaling_behavior = "DEFAULT"
      sharpness        = 50
      height           = 1080
      width            = 1920

      codec_settings {
        h264_settings {
          adaptive_quantization   = "HIGH"
          afd_signaling           = "NONE"
          bitrate                 = 8000000
          buf_fill_pct            = 0
          buf_size                = 0
          color_metadata          = "INSERT"
          entropy_encoding        = "CABAC"
          flicker_aq              = "ENABLED"
          force_field_pictures    = "DISABLED"
          framerate_control       = "SPECIFIED"
          framerate_denominator   = 1001
          framerate_numerator     = 30000
          gop_b_reference         = "DISABLED"
          gop_closed_cadence      = 1
          gop_num_b_frames        = 1
          gop_size                = 60
          gop_size_units          = "FRAMES"
          level                   = "H264_LEVEL_4_1"
          look_ahead_rate_control = "HIGH"
          max_bitrate             = 0
          min_i_interval          = 0
          num_ref_frames          = 1
          par_control             = "SPECIFIED"
          par_denominator         = 0
          par_numerator           = 0
          profile                 = "HIGH"
          qvbr_quality_level      = 0
          rate_control_mode       = "CBR"
          scan_type               = "PROGRESSIVE"
          scene_change_detect     = "ENABLED"
          slices                  = 0
          softness                = 0
          spatial_aq              = "ENABLED"
          subgop_length           = "FIXED"
          syntax                  = "DEFAULT"
          temporal_aq             = "ENABLED"
          timecode_insertion      = "DISABLED"
        }
      }
    }

    output_groups {
      name = "streamzen-settings-dev"

      output_group_settings {
        media_package_group_settings {
          destination {
            destination_ref_id = "streamzen-medialive-mediapackage"
          }
        }
      }

      outputs {
        output_name             = "1280_720"
        video_description_name  = "video_1280_720"
        audio_description_names = ["audio_3_aac96"]
        output_settings {
          media_package_output_settings {
          }
        }
      }
      outputs {
        output_name             = "1920_1080"
        video_description_name  = "video_1920_1080"
        audio_description_names = ["audio_3_aac128"]
        output_settings {
          media_package_output_settings {
          }
        }
      }
    }
  }
}

# IAM COMPONENTS ------------------------------------------------------------
data "aws_iam_policy_document" "assume_role_medialive" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["medialive.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "medialive_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups",
    ]
    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:ListAllMyBuckets",
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = [
      "*", # This might be too permissive
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "mediastore:ListContainers",
      "mediastore:PutObject",
      "mediastore:GetObject",
      "mediastore:DeleteObject",
      "mediastore:DescribeObject",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "mediaconnect:ManagedDescribeFlow",
      "mediaconnect:ManagedAddOutput",
      "mediaconnect:ManagedRemoveOutput",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "mediapackage:DescribeChannel",
      "mediapackagev2:PutObject",
      "mediapackagev2:GetChannel",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "ec2:describeSubnets",
      "ec2:describeNetworkInterfaces",
      "ec2:createNetworkInterface",
      "ec2:createNetworkInterfacePermission",
      "ec2:deleteNetworkInterface",
      "ec2:deleteNetworkInterfacePermission",
      "ec2:describeSecurityGroups",
      "ec2:describeAddresses",
      "ec2:associateAddress",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "kms:GenerateDataKey",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "ssm:Describe*",
      "ssm:Get*",
      "ssm:List*",
    ]
    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "medialive_policy" {
  name   = "streamzen-medialive-policy-${var.environment}"
  policy = data.aws_iam_policy_document.medialive_policy.json
}

resource "aws_iam_role" "medialive_role" {
  name               = "streamzen-medialive-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_medialive.json
}

resource "aws_iam_role_policy_attachment" "medialive_policy_attachment" {
  role       = aws_iam_role.medialive_role.id
  policy_arn = aws_iam_policy.medialive_policy.arn
}

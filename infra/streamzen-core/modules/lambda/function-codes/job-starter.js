import {
  CreateJobCommand,
  MediaConvertClient,
} from "@aws-sdk/client-mediaconvert";

const emcClient = new MediaConvertClient({
  endpoint: process.env.MEDIACONVERT_ENDPOINT,
});

const assembleJobCommand = (config) =>
  ({
    Queue: config.jobQueueArn,
    UserMetadata: {
      application: `streamzen-${process.env.ENVIRONMENT_NAME}`,
      id: `${config.id}`,
      uploadedFilename: `${config.uploadedFilename}`,
    },
    Role: config.iamRoleArn,
    StatusUpdateInterval: "SECONDS_20", // how often the job status is updated
    Settings: {
      OutputGroups: [
        {
          CustomName: "hls_out",
          Name: "Apple HLS",
          Outputs: [
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  VideoPid: 481,
                  AudioPids: [
                    482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492,
                  ],
                },
              },
              VideoDescription: {
                Height: 1080,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    Syntax: "DEFAULT",
                    MaxBitrate: 10000000,
                    SlowPal: "DISABLED",
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "QVBR",
                    Telecine: "NONE",
                    FieldEncoding: "PAFF",
                    QualityTuningLevel: "SINGLE_PASS_HQ",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                  },
                },
                DropFrameTimecode: "ENABLED",
              },
              AudioDescriptions: [
                {
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 256000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  IFrameOnlyManifest: "EXCLUDE",
                  AudioOnlyContainer: "AUTOMATIC",
                },
              },
              NameModifier: "_1080p",
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {
                  AudioFramesPerPes: 4,
                  PcrControl: "PCR_EVERY_PES_PACKET",
                  PmtPid: 480,
                  PrivateMetadataPid: 503,
                  ProgramNumber: 1,
                  PatInterval: 0,
                  PmtInterval: 0,
                  NielsenId3: "NONE",
                  TimedMetadata: "NONE",
                  TimedMetadataPid: 502,
                  VideoPid: 481,
                  AudioPids: [
                    482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492,
                  ],
                },
              },
              VideoDescription: {
                Height: 720,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    Syntax: "DEFAULT",
                    MaxBitrate: 5000000,
                    SlowPal: "DISABLED",
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "QVBR",
                    Telecine: "NONE",
                    FieldEncoding: "PAFF",
                    QualityTuningLevel: "SINGLE_PASS_HQ",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    GopSizeUnits: "AUTO",
                  },
                },
                DropFrameTimecode: "ENABLED",
              },
              AudioDescriptions: [
                {
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 192000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              OutputSettings: {
                HlsSettings: {
                  AudioGroupId: "program_audio",
                  IFrameOnlyManifest: "EXCLUDE",
                  AudioOnlyContainer: "AUTOMATIC",
                },
              },
              NameModifier: "_720p",
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {},
              },
              VideoDescription: {
                Height: 480,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    MaxBitrate: 2000000,
                    RateControlMode: "QVBR",
                    SceneChangeDetect: "TRANSITION_DETECTION",
                  },
                },
              },
              AudioDescriptions: [
                {
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 128000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              OutputSettings: {
                HlsSettings: {},
              },
              NameModifier: "_480p",
            },
            {
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {},
              },
              VideoDescription: {
                Height: 360,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    MaxBitrate: 1000000,
                    RateControlMode: "QVBR",
                    SceneChangeDetect: "TRANSITION_DETECTION",
                  },
                },
              },
              AudioDescriptions: [
                {
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 96000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              OutputSettings: {
                HlsSettings: {},
              },
              NameModifier: "_360p",
            },
          ],
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              ManifestDurationFormat: "INTEGER",
              SegmentLength: 10,
              TimedMetadataId3Period: 10,
              CaptionLanguageSetting: "OMIT",
              Destination: `${config.dest}`, // where the output file will be
              TimedMetadataId3Frame: "PRIV",
              CodecSpecification: "RFC_4281",
              OutputSelection: "MANIFESTS_AND_SEGMENTS",
              ProgramDateTimePeriod: 600,
              MinSegmentLength: 0,
              MinFinalSegmentLength: 0,
              DirectoryStructure: "SINGLE_DIRECTORY",
              ProgramDateTime: "EXCLUDE",
              SegmentControl: "SEGMENTED_FILES",
              ManifestCompression: "NONE",
              ClientCache: "ENABLED",
              AudioOnlyHeader: "INCLUDE",
              StreamInfResolution: "INCLUDE",
            },
          },
        },
      ],
      AdAvailOffset: 0,
      FollowSource: 1,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              Offset: 0,
              DefaultSelection: "DEFAULT",
              ProgramSelection: 1,
            },
          },
          VideoSelector: {
            ColorSpace: "FOLLOW",
            Rotate: "DEGREE_0",
            AlphaBehavior: "DISCARD",
          },
          FilterEnable: "AUTO",
          PsiControl: "USE_PSI",
          FilterStrength: 0,
          DeblockFilter: "DISABLED",
          DenoiseFilter: "DISABLED",
          InputScanType: "AUTO",
          TimecodeSource: "ZEROBASED",
          FileInput: `${config.origin}`, // where the input file is
        },
      ],
    },
  });

export const handler = async (event, context) => {
  const callerInput = event.Records[0].s3;

  // console.log("[INFO] Caller input", JSON.stringify(callerInput, null, 2));

  const config = {
    jobQueueArn: process.env.JOB_QUEUE_ARN,
    iamRoleArn: process.env.IAM_ROLE_ARN,
    origin: `${process.env.INPUT_BUCKET_URI}/${callerInput.object.key}`,
    dest: `${process.env.OUTPUT_BUCKET_URI}/${callerInput.object.key}`,
    id: callerInput.object.key.split("/")[0],
    uploadedFilename: callerInput.object.key.split("/")[1],
  };

  try {
    const jobCommand = assembleJobCommand(config);
    console.log("[INFO] Job on the way!", JSON.stringify(jobCommand, null, 2));
    const data = await emcClient.send(new CreateJobCommand(jobCommand));
    console.log("[INFO] Job created!", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("[FAIL] Error", err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

import {
  CreateJobCommand,
  MediaConvertClient,
} from "@aws-sdk/client-mediaconvert";

const emcClient = new MediaConvertClient({
  endpoint: process.env.MEDIACONVERT_ENDPOINT,
});

const assembleJobCommand = (config) =>
  new CreateJobCommand({
    Queue: config.jobQueueArn,
    UserMetadata: {
      Customer: "Amazon",
    },
    Role: config.iamRoleArn,
    Settings: {
      OutputGroups: [
        {
          Name: "File Group",
          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: `${config.outputBucketUri}/${config.outputDir}`,
            },
          },
          Outputs: [
            {
              VideoDescription: {
                ScalingBehavior: "DEFAULT",
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 5000000,
                    FramerateControl: "SPECIFIED",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "SPECIFIED",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    FramerateNumerator: 30,
                    FramerateDenominator: 1,
                    ParNumerator: 1,
                    ParDenominator: 1,
                  },
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT",
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4",
                      Bitrate: 64000,
                    },
                  },
                  LanguageCodeControl: "FOLLOW_INPUT",
                  AudioSourceName: "Audio Selector 1",
                },
              ],
              ContainerSettings: {
                Container: "MP4",
                Mp4Settings: {
                  CslgAtom: "INCLUDE",
                  FreeSpaceBox: "EXCLUDE",
                  MoovPlacement: "PROGRESSIVE_DOWNLOAD",
                },
              },
              NameModifier: "_1",
            },
          ],
        },
      ],
      AdAvailOffset: 0,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              Offset: 0,
              DefaultSelection: "NOT_DEFAULT",
              ProgramSelection: 1,
              SelectorType: "TRACK",
              Tracks: [1],
            },
          },
          VideoSelector: {
            ColorSpace: "FOLLOW",
          },
          FilterEnable: "AUTO",
          PsiControl: "USE_PSI",
          FilterStrength: 0,
          DeblockFilter: "DISABLED",
          DenoiseFilter: "DISABLED",
          TimecodeSource: "EMBEDDED",
          FileInput: `${config.inputBucketUri}/${config.filePath}`,
        },
      ],
      TimecodeConfig: {
        Source: "EMBEDDED",
      },
    },
  });

export const handler = async (event, context) => {
  const callerInput = event.Records[0].s3;
  const config = {
    jobQueueArn: process.env.JOB_QUEUE_ARN,
    iamRoleArn: process.env.IAM_ROLE_ARN,
    outputBucketUri: process.env.OUTPUT_BUCKET_URI,
    outputDir: callerInput.object.key.split("/")[0],
    inputBucketUri: process.env.INPUT_BUCKET_URI,
    filePath: callerInput.object.key,
  }

  try {
    const jobCommand = assembleJobCommand(config);
    console.log("[INFO] Job on the way!", config);
    const data = await emcClient.send(jobCommand);
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

export const handler = async (event, context, callback) => {
  // console.log("Received event:", JSON.stringify(event, null, 2));
  const {
    status,
    userMetadata: { id, uploadedFilename },
  } = event.detail;
  const jobPercentComplete =
    event.detail.jobProgress?.jobPercentComplete || 100;

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/videos/${id}/progress`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadedFilename,
          status,
          jobPercentComplete,
        }),
      }
    );
    const data = await response.json();
    console.log("[INFO] Backend response", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("[FAIL] Error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

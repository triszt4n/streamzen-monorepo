export const handler = async (event, context, callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const detail = event.detail;
};

function handler(event) {
  const request = event.request;

  // Remove the prefix from the request URI
  ["/media-assets/", "/media-live/"].forEach((prefix) => {
    request.uri = request.uri.replace(prefix, "/");
  });
  return request;
}

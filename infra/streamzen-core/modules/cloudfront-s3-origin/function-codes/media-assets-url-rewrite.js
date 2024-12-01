function handler(event) {
  event.request.uri = event.request.uri.replace(
    "/media-assets/",
    "/"
  );
  return event.request;
}

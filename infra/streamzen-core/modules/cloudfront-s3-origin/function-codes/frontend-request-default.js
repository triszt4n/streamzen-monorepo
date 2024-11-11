const spaInternalRoutingPrefixes = [
  "/videos",
  "/events",
  "/members",
  "/courses",
  "/about",
  "/studio",
];

function handler(event) {
  var request = event.request;
  if (
    spaInternalRoutingPrefixes.some((prefix) => request.uri.startsWith(prefix))
  ) {
    request.uri = "/";
  }
  return request;
}

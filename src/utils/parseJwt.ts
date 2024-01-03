export function parseJwt(token: string) {
  const base64Url = token.split(".")[1]; // Get the payload
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert Base64Url to Base64
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

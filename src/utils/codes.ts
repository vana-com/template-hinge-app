// Function to generate codeChallenge from codeVerifier
export async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const codeVerifier =
  "YPgMzR_ayjXC4UGfzKoBrN0yBumTAIC5sXMV1BD4Tf2wpEG1MGfEiQHXmpI6n~fRRh~yF5HJd5nFkXbAA-sxi8nEzKU_su588Nz2MjuS9XjzwRLMqVyYKAEijwrloW7H"; // generateRandomString(128);// export const codeChallenge = generateCodeChallenge(codeVerifier);

import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code, codeVerifier } = req.body;

  // Exchange the authorization code for an access token
  const tokenRequestBody = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
    code_verifier: codeVerifier,
    code,
  });

  try {
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VANA_OAUTH_URL}/oauth2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenRequestBody.toString(),
      }
    );

    const tokenData = await tokenResponse.json();

    console.log(tokenData);

    if (tokenData.error) {
      throw new Error(tokenData);
    }

    // We place tokenData in both cookies and localStorage, because api routes require cookies to be set, and localStorage is more convenient elsewhere
    // FIXME: Expiration is not being handled properly yet

    // Calculate maxAge for the cookie
    const maxAge = tokenData.expires_in; // Time in seconds until expiration

    // Set token in HTTP-only cookie
    res.setHeader("Set-Cookie", [
      serialize("token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: maxAge,
      }),
      serialize("id_token", tokenData.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: maxAge,
      }),
    ]);

    // Set token in localStorage
    localStorage.setItem("token", tokenData.access_token);
    localStorage.setItem("id_token", tokenData.id_token);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

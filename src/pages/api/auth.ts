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

    // Set token in HTTP-only cookie
    res.setHeader("Set-Cookie", [
      serialize("token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: 3600, // Expires in 1 hour
      }),
      serialize("id_token", tokenData.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: 3600, // Expires in 1 hour
      }),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

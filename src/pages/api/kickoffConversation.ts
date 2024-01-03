import { parseJwt } from "@/utils/parseJwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const accessToken = req.cookies.token; // Assuming the access token is stored in an HTTP-only cookie named 'token'
  const idToken = req.cookies.id_token; // Assuming the ID token is stored in an HTTP-only cookie named 'id_token'

  //   if (!accessToken || !idToken) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  try {
    // Assuming idToken is the JWT ID token you received
    const decodedToken = parseJwt(idToken);
    const accountId = decodedToken.sub;
    console.log(accessToken, accountId);

    const ANNA = "088473d6-e972-426a-b2bc-f74e2a374dd1";
    const CONNOR = "08aa7ae0-43e1-40f7-8f43-df84d0f11108"; // Does not work until character completes setup.

    const vanaResponse = await fetch(
      `https://development-gotchi-js-api.vana.com/api/v0/conversations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: ANNA,
        }),
      }
    );

    console.log(vanaResponse);
    if (!vanaResponse.ok) {
      throw new Error("Failed to create conversation");
    }

    const responseData = await vanaResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

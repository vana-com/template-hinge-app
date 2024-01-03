import { parseJwt } from "@/utils/parseJwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { conversationId } = req.query;

  const accessToken = req.cookies.token; // Assuming the access token is stored in an HTTP-only cookie named 'token'
  const idToken = req.cookies.id_token; // Assuming the ID token is stored in an HTTP-only cookie named 'id_token'

  if (!accessToken || !idToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Assuming idToken is the JWT ID token you received
    const decodedToken = parseJwt(idToken);
    const accountId = decodedToken.sub;

    console.log(accountId);
    console.log(accessToken);

    const vanaResponse = await fetch(
      `https://development-gotchi-js-api.vana.com/api/v0/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
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

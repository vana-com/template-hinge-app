import { parseJwt } from "@/utils/parseJwt";

export default async function handler(req, res) {
  const accessToken = req.cookies.token; // Assuming the access token is stored in an HTTP-only cookie named 'token'
  const idToken = req.cookies.id_token; // Assuming the ID token is stored in an HTTP-only cookie named 'id_token'

  try {
    // Assuming idToken is the JWT ID token you received
    const decodedToken = parseJwt(idToken);
    const accountId = decodedToken.sub;
    console.log(req.body.conversationId);
    console.log(req.body.data);

    console.log(accessToken);

    // Before sending a message, clear the existing conversation history.
    // https://api.vana.com/api/v0/conversations/:conversation-id/clear
    const clearResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VANA_API_URL}/api/v0/conversations/${req.body.conversationId}/clear`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!clearResponse.ok) {
      throw new Error("Failed to clear conversation");
    }
    const clearData = await clearResponse.json();
    console.log(clearData);

    const vanaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VANA_API_URL}/api/v0/conversations/${req.body.conversationId}/chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: req.body.data,
          // mimeType: "text/plain",
          // allow: ["text/plain"],
        }),
      }
    );

    if (!vanaResponse.ok) {
      throw new Error("Failed to send message");
    }

    const responseData = await vanaResponse.json();
    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

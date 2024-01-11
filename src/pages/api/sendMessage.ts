import { parseJwt } from "@/utils/parseJwt";

export default async function handler(req, res) {
  // if (req.method !== "POST") {
  //   res.status(405).json({ message: "Method not allowed" });
  // }

  const accessToken = req.cookies.token; // Assuming the access token is stored in an HTTP-only cookie named 'token'
  const idToken = req.cookies.id_token; // Assuming the ID token is stored in an HTTP-only cookie named 'id_token'

  //   if (!accessToken || !idToken) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  try {
    // Assuming idToken is the JWT ID token you received
    const decodedToken = parseJwt(idToken);
    const accountId = decodedToken.sub;
    console.log(req.body.conversationId);
    console.log(req.body.data);

    console.log(accessToken);

    const vanaResponse = await fetch(
      `https://development-gotchi-js-api.vana.com/api/v0/conversations/${req.body.conversationId}/chat`,
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

    console.log(vanaResponse);
    // if (!vanaResponse.ok) {
    //   throw new Error("Failed to send message");
    // }

    const responseData = await vanaResponse.json();
    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

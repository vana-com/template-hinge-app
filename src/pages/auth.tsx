import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function auth() {
  return <AuthPage />;
}

function AuthPage() {
  const router = useRouter();
  const { code, state, error } = router.query; // Extract 'code' and 'state' from URL

  // If auth was cancelled, redirect to home
  useEffect(() => {
    if (error === "access_denied") {
      router.push("/");
    }
  }, [state]);

  // Kickoff conversation
  useEffect(() => {
    const sendCodeToServer = async () => {
      if (!code) return;

      if (localStorage.getItem("pkce_state") !== state) {
        throw new Error("Invalid state");
      }

      try {
        // Exchange the authorization code for an access token
        const tokenRequestBody = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
          code_verifier: localStorage.getItem("pkce_code_verifier"),
          code,
        });

        const tokenResponse = await fetch(
          `${process.env.NEXT_PUBLIC_VANA_OAUTH_URL}/oauth2/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: tokenRequestBody.toString(),
          }
        );

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          throw new Error(tokenData);
        }

        if (tokenData.access_token) {
          alert("Authenticated!");

          // Set token in localStorage
          localStorage.setItem("token", tokenData.access_token);
          localStorage.setItem("id_token", tokenData.id_token);

          // Set a non-HTTP-only cookie on the client side
          const maxAge = tokenData.expires_in; // Time in seconds until expiration
          document.cookie = `token=${tokenData.access_token}; path=/; secure; samesite=strict; max-age=${maxAge}`;
          document.cookie = `id_token=${tokenData.id_token}; path=/; secure; samesite=strict; max-age=${maxAge}`;

          router.push("/");

          // Clean these up since we don't need them anymore
          // localStorage.removeItem("pkce_state");
          // localStorage.removeItem("pkce_code_verifier");
        }
      } catch (error) {
        throw new Error("Error authenticating");
      }
    };

    sendCodeToServer();
  }, [router, code, state]);

  return null;
}

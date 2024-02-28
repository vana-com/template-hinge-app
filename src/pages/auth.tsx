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
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            codeVerifier: localStorage.getItem("pkce_code_verifier"),
          }),
        });
        const data = await response.json();

        if (data.success === true) {
          alert("Authenticated!");

          localStorage.setItem("auth_token", data.token);

          router.push("/");

          // Clean these up since we don't need them anymore
          // localStorage.removeItem("pkce_state");
          // localStorage.removeItem("pkce_code_verifier");
        }
      } catch (error) {
        console.error(error);
      }
    };

    sendCodeToServer();
  }, [router, code]);

  return null;
}

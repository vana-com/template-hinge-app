import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { codeVerifier } from "@/utils/codes";

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

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: Array.isArray(code) ? code[0] : code,
            codeVerifier,
          }),
        });
        const data = await response.json();
        console.log(data); // Handle response
        if (data.success === true) {
          router.push("/?auth=success");
        }
      } catch (error) {
        console.error(error);
      }
    };

    sendCodeToServer();
  }, [code, codeVerifier]);

  return null;
}

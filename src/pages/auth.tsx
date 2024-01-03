import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { codeVerifier } from "@/utils/codes";

export default function auth() {
  return <AuthPage />;
}

function AuthPage() {
  const router = useRouter();
  const { code, state } = router.query; // Extract 'code' and 'state' from URL

  // Call this function in your component's useEffect or a relevant event handler

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
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    };

    sendCodeToServer();
  }, [code, codeVerifier]);

  return null;
}

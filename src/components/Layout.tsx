import { useAccount } from "@/hooks/useAccount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pkceChallengeFromVerifier, generateRandomString } from "@/utils/codes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { account, isLoading, isError } = useAccount();
  const router = useRouter();
  const [userHasToken, setUserHasToken] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          console.log("User is authenticated");
          setUserHasToken(true);
        } else {
          console.log("User is not authenticated");
          setUserHasToken(false);
        }
      } catch (error) {
        console.error("Error checking authentication status", error);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  // If user is on /auth, just show children
  if (router.pathname === "/auth") {
    return children;
  }

  if ((!account && !isLoading) || !userHasToken) {
    return <LoginButton />;
  }

  if (isError) {
    return <div>Error loading account</div>;
  }

  return (
    <div>
      Welcome, {account?.username}! {children}
    </div>
  );
}

// Encapsulate all oauth logic in a reusable component
function LoginButton() {
  useEffect(() => {
    kickoffAuth();
  }, []);

  const [oAuthUrl, setOAuthUrl] = useState("");
  async function kickoffAuth() {
    const STATE = generateRandomString();
    localStorage.setItem("pkce_state", STATE);

    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    const RESPONSE_TYPE = "code";
    const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
    const SCOPE = "openid offline";
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;

    // Hash and base64-urlencode the secret to use as the challenge
    const CODE_CHALLENGE = await pkceChallengeFromVerifier(codeVerifier);
    const CODE_CHALLENGE_METHOD = "S256";

    const url = `${process.env.NEXT_PUBLIC_VANA_OAUTH_URL}/oauth2/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&state=${STATE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&code_challenge=${CODE_CHALLENGE}&code_challenge_method=${CODE_CHALLENGE_METHOD}`;

    setOAuthUrl(url);
  }

  return (
    <a
      href={oAuthUrl}
      className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
    >
      Login with Vana
    </a>
  );
}

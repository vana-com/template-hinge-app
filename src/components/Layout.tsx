// In your Layout component or any page component
import { useAccount } from "@/hooks/useAccount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pkceChallengeFromVerifier, generateRandomString } from "@/utils/codes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { account, isLoading, isError } = useAccount();
  const router = useRouter();
  const [oAuthUrl, setOAuthUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for an existing auth token in localStorage
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      // Implement a method to validate the token if necessary
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (router.pathname !== "/auth") {
        // Initiate authentication flow if not on /auth page and no token found
        initiateAuthFlow();
      }
    }
  }, [router.pathname]);

  const initiateAuthFlow = () => {
    // Your existing authentication flow logic
    // Ensure this logic is only executed when necessary (e.g., no valid token)
    if (localStorage.getItem("pkce_state") !== null) return;

    const STATE = generateRandomString();
    localStorage.setItem("pkce_state", STATE);
    const codeVerifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", codeVerifier);

    async function kickoffAuth() {
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
    kickoffAuth();
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  // If user is on /auth, just show children
  if (router.pathname === "/auth") {
    return children;
  }

  if (!account && !isAuthenticated) {
    return (
      <a
        href={oAuthUrl}
        className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
      >
        Login with Vana
      </a>
    );
  }

  return (
    <div>
      Welcome, {account?.username}! {children}
    </div>
  );
}

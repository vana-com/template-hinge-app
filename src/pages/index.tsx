import HingeCard from "@/components/HingeCard";
import { useEffect, useMemo, useState } from "react";
import {
  codeChallenge,
  codeVerifier,
  generateCodeChallenge,
} from "@/utils/codes";
import { Account, Conversation, PromptAndResponse } from "@/types";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";

const PROMPT_ENGINEERING_INSTRUCTIONS =
  "Finish the sentence and keep your response under 30 words: ";
const prompts = [
  "This year, I really want to...",
  "I recently discovered that...",
  "I'm looking for...",
  "A shower thought I recently had...",
  "My most irrational fear is...",
  "A perfect day for me looks like...",
  "My go-to karaoke song is...",
  "On Sundays, you can usually find me...",
  "I get along best with people who...",
  "The last book I read and loved was...",
  "I'm weirdly attracted to...",
  "If I could travel anywhere, I'd go to...",
  "An underrated pleasure of mine is...",
  "Something that's non-negotiable for me is...",
  "The best gift I've ever received was...",
  "My favorite family tradition is...",
  "A skill I want to master this year is...",
  "The way to win me over is...",
  "Something that makes me laugh out loud...",
  "I'm secretly really good at...",
  "A random fact I love is...",
  "The best adventure I've been on...",
  "My ideal weekend includes...",
  "I feel most empowered when...",
  "One thing I'll never do again is...",
  "My greatest accomplishment so far is...",
  "If I had one superpower, it would be...",
  "The most spontaneous thing I've done is...",
  "A cause I'm passionate about is...",
  "The quirkiest thing about me is...",
];

export default function Home() {
  const router = useRouter();

  const [oAuthUrl, setOAuthUrl] = useState("");
  useEffect(() => {
    async function kickoffAuth() {
      const RESPONSE_TYPE = "code";
      const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
      const STATE = "1234567890";
      const SCOPE = "openid offline";
      const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
      const CODE_CHALLENGE = await generateCodeChallenge(codeVerifier);
      const CODE_CHALLENGE_METHOD = "S256";
      const url = `https://development-oauth.vana.com/oauth2/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&state=${STATE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&code_challenge=${CODE_CHALLENGE}&code_challenge_method=${CODE_CHALLENGE_METHOD}`;

      setOAuthUrl(url);
    }
    kickoffAuth();
  }, []);

  const [account, setAccount] = useState<Account | undefined>(undefined);
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/account");
      if (!response.ok) {
        throw new Error("Failed to fetch account");
      }
      const res = await response.json();
      console.log(res); // Process accounts data
      if (res.success) {
        setAccount(res.account);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // const getConversation = async (conversationId: string) => {
  //   const response = await fetch(
  //     `/api/getConversation?conversationId=${conversationId}`
  //   );

  //   console.log(response);

  //   if (!response.ok) {
  //     throw new Error("Failed to grab conversation");
  //   }

  //   const res = await response.json();
  //   if (res.id) {
  //     console.log(res); // Process accounts data
  //     setConversation(res);
  //   }
  // };

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const kickoffConversation = async () => {
    const response = await fetch("/api/kickoffConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to kickoff conversation");
    }
    const res = await response.json();

    if (res.id) {
      console.log("Conversation:", res); // Process accounts data
      setConversation(res);

      // localStorage.setItem("conversationId", res.id);
      // Append the conversation ID to the router
      router.push(`?conversation=${res.id}`);
    }
  };

  // On page load, if there is a conversation ID in the URL, fetch the conversation
  useEffect(() => {
    async function getConversationFromUrl() {
      const conversationId = router.query.conversation;
      console.log(conversationId);
      if (conversationId) {
        try {
          const response = await fetch(
            `/api/getConversation?conversationId=${conversationId}`
          );

          console.log(response);

          if (!response.ok) {
            throw new Error("Failed to grab conversation");
          }

          const res = await response.json();
          if (res.id) {
            console.log(res); // Process accounts data
            setConversation(res);
          }
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }
      }
    }
    getConversationFromUrl();
  }, [router]);

  // const [promptsAndResponses, setPromptsAndResponses] = useState<
  //   PromptAndResponse[]
  //   >([]);

  const [promptsAndResponses, setPromptsAndResponses] = useLocalStorage<
    PromptAndResponse[]
  >("promptsAndResponses", []);

  const nextPrompt = useMemo(() => {
    return prompts[promptsAndResponses.length];
  }, [promptsAndResponses]);

  // useEffect(() => {
  //   async function getOrKickoffConversation() {
  //     const conversationId = localStorage.getItem("conversationId");
  //     console.log(conversationId);
  //     if (conversationId) {
  //       try {
  //         await getConversation(conversationId);
  //       } catch (error) {
  //         await kickoffConversation();
  //       }
  //     }

  //     // if (account) {
  //     //   await kickoffConversation();
  //     // }
  //   }
  //   getOrKickoffConversation();
  // }, [account]);

  // Whenever promptsAndResponses changes, refetch the conversation
  // useEffect(() => {
  //   async function kickoffConversationAsync() {
  //     await getConversation(conversation.id);
  //   }
  //   if (promptsAndResponses.length > 0) {
  //     getConversation(conversation.id);
  //   }
  // }, [promptsAndResponses, conversation]);

  return (
    <main
      className={`p-4 flex flex-col items-center min-h-screen ${
        conversation ? "justify-start" : "justify-center"
      }`}
    >
      {account && !conversation && (
        <p className="mb-2">Welcome, {account.username}!</p>
      )}
      {!account && (
        <a
          href={oAuthUrl}
          className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
        >
          Login with Vana
        </a>
      )}

      {/* {conversation && <h1>Conversation: {conversation.id}</h1>} */}

      {account && !conversation ? (
        <button
          onClick={kickoffConversation}
          className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
        >
          Kickoff Conversation
        </button>
      ) : null}

      <div className="h-2" />

      {conversation ? (
        <>
          <GenerateNewPromptInput
            nextPrompt={nextPrompt}
            conversation={conversation}
            promptsAndResponses={promptsAndResponses}
            setPromptsAndResponses={setPromptsAndResponses}
          />
          <DesktopLayout renderedPrompts={promptsAndResponses} />
        </>
      ) : null}
    </main>
  );
}

function GenerateNewPromptInput({
  nextPrompt,
  conversation,
  promptsAndResponses,
  setPromptsAndResponses,
}: {
  nextPrompt: string;
  conversation: Conversation;
  promptsAndResponses: PromptAndResponse[];
  setPromptsAndResponses: (promptsAndResponses: PromptAndResponse[]) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const sendMessage = async (conversationId: string, message: string) => {
    console.log("Sending message to", conversationId);
    setIsGenerating(true);
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversationId,
        data: message,
      }),
    });

    console.log(response);
    if (!response.ok) {
      setIsGenerating(false);
      throw new Error("Failed to send message");
    }
    const res = await response.json();
    console.log(res);

    const prompt = message.replace(PROMPT_ENGINEERING_INSTRUCTIONS, "");
    const responseMessage = res.message;

    setPromptsAndResponses([
      ...promptsAndResponses,
      { prompt, response: responseMessage },
    ]);

    setIsGenerating(false);
  };

  return (
    <div className="flex justify-center w-full pt-16">
      <button
        className={`mb-4 p-4 z-10 fixed top-4 left-4 bg-black text-white rounded-xl w-[calc(100%-2rem)] font-sans ${
          isGenerating
            ? "animate-pulse cursor-wait"
            : !nextPrompt
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
        disabled={!nextPrompt || isGenerating}
        onClick={() => {
          sendMessage(
            conversation.id,
            `${PROMPT_ENGINEERING_INSTRUCTIONS}${nextPrompt}`
          );
        }}
      >
        Generate New Prompt 🎉
      </button>
    </div>
  );
}

function DesktopLayout({
  renderedPrompts,
}: {
  renderedPrompts: PromptAndResponse[];
}) {
  const [type, setType] = useState<"smallBig" | "serifSans">("smallBig");
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        className="fixed z-10 bottom-2 right-2 px-4 py-2 bg-black text-white rounded-xl font-sans"
        onClick={() => setType(type === "smallBig" ? "serifSans" : "smallBig")}
      >
        Toggle type
      </button>
      {renderedPrompts.map((prompt) => (
        <HingeCard
          key={prompt.prompt}
          prompt={prompt.prompt}
          response={prompt.response}
          type={type}
        />
      ))}
    </section>
  );
}

// function PhoneLayout({
//   renderedPrompts,
// }: {
//   renderedPrompts: PromptAndResponse[];
// }) {
//   return (
//     <section className="max-w-xl mx-auto">
//       <h1 className="text-4xl font-sans font-bold mb-2">Connor (gotchi)</h1>

//       <img
//         src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
//         alt="Connor"
//         className="rounded-xl mb-8"
//       />

//       <div className="grid grid-cols-1 gap-4">
//         {renderedPrompts.map((prompt) => (
//           <HingeCard
//             key={prompt.prompt}
//             prompt={prompt.prompt}
//             response={prompt.response}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

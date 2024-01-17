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
import LandingPage from "@/components/Landing";

const PROMPT_ENGINEERING_INSTRUCTIONS =
  "You are a funny, charismatic person on a dating app. Write a short, concise answer to the question:\nQuestion: This year, I really want to...\nAnswer: Travel to Japan.\n\nQuestion: This year, I really want to...\nAnswer: Learn how to cook something other than Kraft Mac and Cheese.\n\nQuestion: This year, I really want to...\nAnswer: Get Lasik surgery ¯\\_(ツ)_/¯\n\nQuestion: I recently discovered that...\nAnswer: I'm a great date!\n\nQuestion: I recently discovered that...\nAnswer: Hangovers last two days over the age of 25.\n\nQuestion: I recently discovered that...\nAnswer: You think I'm hot. ;)\n\nQuestion: I'm looking for...\nAnswer: Someone who's comfortable with non-monogamy!\n\nQuestion: I'm looking for...\nAnswer: Someone who's down to laugh, but also get deep.\n\nQuestion: I'm looking for...\nAnswer: A father figure for my dog.\n\nQuestion: A shower thought I recently had...\nAnswer: Damn, this is hot.\n\nQuestion: A shower thought I recently had...\nAnswer: This would be so much better as a bubble bath.\n\nQuestion: My typical Sunday...\nAnswer: Work out and grocery shop for the week ahead!\n\nQuestion: My typical Sunday...\nAnswer: I'm all about the Sunday Funday vibe—boozy brunch is the move.\n\nQuestion: My typical Sunday...\nAnswer: Wishing I could get Chick-fil-A.\n\nQuestion: The best way to ask me out is by...\nAnswer: By just asking me.\n\nQuestion: The best way to ask me out is by...\nAnswer: Taking me out for charcuterie and wine.\n\nQuestion: The best way to ask me out is by...\nAnswer: Ditching small talk about our weekends and inviting me to dinner.\n\nQuestion: My best travel story...\nAnswer: That time I spent 24 hours in a jail abroad.\n\nQuestion: My best travel story...\nAnswer: When I got locked out of my hostel and lived to tell the tale.\n\nQuestion: My best travel story...\nAnswer: That time I missed my flight in Turkey…\n\nQuestion: One thing I'll never do again...\nAnswer: Go to the gym 7 days a week.\n\nQuestion: One thing I'll never do again...\nAnswer: Drink. I've learned that it's just not for me anymore!\n\nQuestion: One thing I'll never do again...\nAnswer: Suffer through a 9-to-5 desk job.\n\nQuestion: You should not go out with me if...\nAnswer: You run 5ks on Thanksgiving.\n\nQuestion: You should not go out with me if...\nAnswer: You're allergic to dogs.\n\nQuestion: You should not go out with me if...\nAnswer: You talk during movies.\n\nQuestion: Something that's non-negotiable for me is...\nAnswer: Having kids.\n\nQuestion: Something that's non-negotiable for me is...\nAnswer: Staying in at least one night every weekend.\n\nQuestion: Something that's non-negotiable for me is...\nAnswer: Traveling the world. Let's do it together!\n\nQuestion: I bet you can't...\nAnswer: Take me out to a baseball game.\n\nQuestion: I bet you can't...\nAnswer: Get me to go on a date with you.\n\nQuestion: I bet you can't...\nAnswer: Cook a better meal than I can.\n\nQuestion: My most controversial opinion is...\nAnswer: Coffee is overrated.\n\nQuestion: My most controversial opinion is...\nAnswer: I'd rather have a 365-day winter than suffer through a year-long summer.\n\nQuestion: My most controversial opinion is...\nAnswer: Reproductive rights are human rights.\n\nQuestion: I'm weirdly attracted to...\nAnswer: People with dogs.\n\nQuestion: I'm weirdly attracted to...\nAnswer: Anyone that can make me laugh so hard my margarita comes out my nose.\n\nQuestion: I'm weirdly attracted to...\nAnswer: Guys that take me on brewery dates.\n\nQuestion: My self-care routine is...\nAnswer: Drinking a bottle of wine while watching trashy television.\n\nQuestion: My self-care routine is...\nAnswer: Doing absolutely nothing at home.\n\nQuestion: My self-care routine is...\nAnswer: Going on a long walk or working out.\n\nQuestion: The key to my heart is...\nAnswer: Someone that gets my dry Complete this sentence in under 50 characters so you can find the love of your life: ";
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
  const kickoffConversation = async (characterId: string) => {
    const response = await fetch("/api/kickoffConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterId: characterId,
      }),
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

  if (!account) {
    return (
      <LandingPage>
        <a
          href={oAuthUrl}
          className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
        >
          Login with Vana
        </a>
      </LandingPage>
    );
  }

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
      {/* If the user has an account but no character ID, they have not completed Vana setup */}
      {account && !account.characterId && (
        <p className="mb-2 flex flex-col items-center justify-center gap-2">
          You need to complete your Vana Gotchi setup before you can use this
          app.
          <a
            href="https://gotchi.vana.com/invite"
            className="px-6 py-2 text-center bg-black text-white w-[300px] mx-auto rounded-lg"
          >
            Vana Gotchi Setup &rarr;
          </a>
        </p>
      )}

      {/* If the user has an account and a character ID, they have completed Vana setup */}
      {account?.characterId && !conversation ? (
        <button
          onClick={() => kickoffConversation(account.characterId)}
          className="px-6 py-2 text-center border border-solid border-black bg-black text-white w-[330px] mx-auto rounded-lg"
        >
          Kickoff Conversation with Yourself
        </button>
      ) : null}

      {account?.characterId && !conversation ? (
        <button
          onClick={
            () => kickoffConversation("45ac30db-45bd-442f-b31a-cab27797a8e6") // Sample character ID
          }
          className="px-6 w-[330px] py-2 text-center bg-white text-black border border-solid border-black mx-auto rounded-lg mt-1"
        >
          Kickoff Conversation with a Sample
        </button>
      ) : null}

      <div className="h-2" />

      {conversation ? (
        <>
          <GenerateNewPromptInput
            isFirstPrompt={promptsAndResponses.length === 0}
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
  isFirstPrompt,
  nextPrompt,
  conversation,
  promptsAndResponses,
  setPromptsAndResponses,
}: {
  isFirstPrompt: boolean;
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
        className={`mb-4 transition-transform duration-500 p-4 z-10 fixed left-4 bg-black text-white rounded-xl w-[calc(100%-2rem)] font-sans 
        ${isFirstPrompt ? "top-1/2 transform -translate-y-1/2" : "top-4"}
        ${
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
        Generate {isFirstPrompt ? "First" : "New"} Prompt 🎉
      </button>
    </div>
  );
}

function DesktopLayout({
  renderedPrompts,
}: {
  renderedPrompts: PromptAndResponse[];
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderedPrompts.map((prompt) => (
        <HingeCard
          key={prompt.prompt}
          prompt={prompt.prompt}
          response={prompt.response}
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

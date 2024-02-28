import { useMemo, useState } from "react";
import { useAccount } from "@/hooks/useAccount";
import { useConversations } from "@/hooks/useConversations";
import { Conversation } from "@/types";
import { useConversation } from "@/hooks/useConversation";

export default function Home() {
  const { account, isLoading, isError } = useAccount();
  const {
    conversations,
    isLoading: isConversationsLoading,
    mutate,
  } = useConversations();

  // Just return the first conversation
  const conversation = useMemo(() => {
    return conversations?.[0];
  }, [conversations]);

  if (isLoading || isConversationsLoading) {
    return <div className="animate-pulse h-96 w-full bg-gray-500" />;
  }

  return (
    <main className="">
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

      {/* Once a conversation exists, render new prompt button and prompts */}
      {conversation ? (
        <ConversationUI conversationId={conversation.id} />
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          No conversation found.{" "}
          <StartConversationButton
            characterId={account?.characterId}
            mutate={mutate}
          />
        </div>
      )}
    </main>
  );
}

function StartConversationButton({
  characterId,
  mutate,
}: {
  characterId: string;
  mutate: () => void;
}) {
  if (!characterId) return null;

  const kickoffConversation = async () => {
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
      mutate();
    }
  };

  return (
    <button
      className="bg-black text-white rounded-lg p-2"
      onClick={() => kickoffConversation()}
    >
      Start one
    </button>
  );
}

function ConversationUI({ conversationId }: { conversationId: string }) {
  const { conversation, isLoading, isError, mutate } =
    useConversation(conversationId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Basic architecture for sending a message to the bot
  const sendMessage = async (conversationId: string, message: string) => {
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

    if (res.success) {
      mutate();
      setPrompt("");
    }

    setIsGenerating(false);
  };

  if (!conversation) {
    return <div className="animate-pulse h-96 w-full bg-gray-500" />;
  }

  return (
    <div className="flex flex-col gap-2 border-t border-gray-300 mt-4 pt-4">
      {/* Send new messages */}
      <p>Conversation: {conversation.id}</p>
      <input
        type="text"
        placeholder="Write a message"
        className="border p-2"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        className={`bg-black text-white rounded-lg p-2 ${
          isGenerating ? "animate-pulse" : ""
        }`}
        disabled={isGenerating || !prompt}
        onClick={() => sendMessage(conversation.id, prompt)}
      >
        Send
      </button>

      {/* List all messages */}
      <div className="flex flex-col gap-2 mt-4">
        {conversation.messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            <p className="text-sm">
              <strong>{message.participantType}</strong>: {message.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

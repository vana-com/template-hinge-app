import { Conversation } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export function useConversation(conversationId: string) {
  const { data, error, mutate } = useSWR<{
    success: boolean;
    conversation: Conversation;
  }>("/api/getConversation?conversationId=" + conversationId, fetcher);

  return {
    conversation: data?.conversation,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

import { Conversation } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export function useConversations() {
  const { data, error, mutate } = useSWR<{
    success: boolean;
    conversations: Conversation[];
  }>("/api/getAllConversations", fetcher);

  return {
    conversations: data?.conversations,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

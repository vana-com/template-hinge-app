import { Account } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export function useAccount() {
  const { data, error } = useSWR<{
    success: boolean;
    account: Account;
  }>("/api/account", fetcher);

  return {
    account: data?.account,
    isLoading: !error && !data,
    isError: error,
  };
}

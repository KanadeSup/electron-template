import { useQuery } from "@tanstack/react-query";
import Logger from "electron-log";
import { getConversationList } from "../api/conversation.api";
import { conversationKey } from "../query-keys/conversation.key";

const LOG_SCOPE = "useGetConversationList";
export function useGetConversationList() {
  return useQuery({
    queryKey: conversationKey.list(),
    queryFn: async () => {
      const response = await getConversationList();
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to fetch conversation list");
        throw new Error(response.errorMessage ?? "Failed to fetch conversation list");
      }
      return response.data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    },
  });
}

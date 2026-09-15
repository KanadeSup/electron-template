import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { deleteConversation } from "../api/conversation.api";
import { conversationKey } from "../query-keys/conversation.key";

const LOG_SCOPE = "useDeleteConversation";

export type UseDeleteConversationParams = {
  conversationId: number;
};

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseDeleteConversationParams) => {
      const response = await deleteConversation(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to delete conversation");
        throw new Error("Failed to delete conversation");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKey.all });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { updateAIProvider } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useUpdateAIProvider";

export type UseUpdateAIProviderParams = {
  id: number;
  enabled?: boolean;
  apiKey?: string;
};

export function useUpdateAIProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseUpdateAIProviderParams) => {
      const response = await updateAIProvider(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to update provider");
        throw new Error("Failed to update provider");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

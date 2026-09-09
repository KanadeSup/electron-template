import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { fetchModelsByProvider } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useFetchModelsByProvider";

export function useFetchModelsByProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (providerId: string) => {
      const response = await fetchModelsByProvider({ providerId });
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to fetch provider models");
        throw new Error("Failed to fetch provider models");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

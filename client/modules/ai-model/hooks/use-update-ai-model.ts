import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { updateAIModel } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useUpdateAIModel";

export type UseUpdateAIModelParams = {
  id: number;
  modelName?: string;
  enabled?: boolean;
};

export function useUpdateAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseUpdateAIModelParams) => {
      const response = await updateAIModel(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to update model");
        throw new Error("Failed to update model");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

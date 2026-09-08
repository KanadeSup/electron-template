import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { deleteAIModel } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useDeleteAIModel";

export type UseDeleteAIModelParams = {
  id: number;
};

export function useDeleteAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseDeleteAIModelParams) => {
      const response = await deleteAIModel(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to delete model");
        throw new Error(response.errorMessage ?? "Failed to delete model");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

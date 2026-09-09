import type { ChangeAIProviderPositionRequest } from "@shared/contracts/ai-provider.contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { changeAIProviderPosition } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useChangeAIProviderPosition";

export type UseChangeAIProviderPositionParams = {
  id: number;
  direction: "up" | "down";
};

export function useChangeAIProviderPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseChangeAIProviderPositionParams) => {
      const response = await changeAIProviderPosition(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(
          response.errorMessage ?? "Failed to change provider position",
        );
        throw new Error("Failed to change provider position");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

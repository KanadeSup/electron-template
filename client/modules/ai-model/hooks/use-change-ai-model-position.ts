import type { ChangeAIModelPositionRequest } from "@shared/contracts/ai-model.contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { changeAIModelPosition } from "../api/ai-model.api";
import { invalidateAIModelQueries } from "../query-key/ai-model.key";

const LOG_SCOPE = "useChangeAIModelPosition";

export type UseChangeAIModelPositionParams = ChangeAIModelPositionRequest;

export function useChangeAIModelPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UseChangeAIModelPositionParams) => {
      const response = await changeAIModelPosition(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to change model position");
        throw new Error("Failed to change model position");
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateAIModelQueries(queryClient);
    },
  });
}

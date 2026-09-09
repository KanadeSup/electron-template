import { useMutation } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { checkAPIKey } from "../api/ai-model.api";

const LOG_SCOPE = "useCheckAPIKey";

export type UseCheckAPIKeyParams = {
  providerId: string;
  apiKey: string;
};

export function useCheckAPIKey() {
  return useMutation({
    mutationFn: async (params: UseCheckAPIKeyParams) => {
      const response = await checkAPIKey(params);
      if (!response.success) {
        Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Failed to validate API key");
        throw new Error("Failed to validate API key");
      }
      return response.data;
    },
  });
}

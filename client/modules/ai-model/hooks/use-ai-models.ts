import { useQuery } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { getAIModels } from "../api/ai-model.api";
import { aiModelsKey } from "../query-key/ai-model.key";

const LOG_SCOPE = "useAIModels";
export type UseAIModelsParams = {
  enabled?: boolean;
  search?: string;
  providerName?: string;
};

export function useAIModels(params: UseAIModelsParams) {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: aiModelsKey.list(params),
    queryFn: async () => {
      const res = await getAIModels({
        enabled: params.enabled,
        search: params.search,
        providerName: params.providerName,
      });
      if (!res.success) {
        Logger.scope(LOG_SCOPE).error(res.errorMessage ?? "Unknown error");
        throw new Error("Unknown error");
      }
      return res.data;
    },
  });
  return { data, isLoading, error, refetch };
}

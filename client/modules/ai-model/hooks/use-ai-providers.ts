import { useQuery } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { getAIModels, getAIProviders } from "../api/ai-model.api";
import { aiModelsKey } from "../query-key/ai-model.key";

const LOG_SCOPE = "useAIProviders";
export type UseAIProvidersParams = {
  enabled?: boolean;
  includeAIModels?: boolean;
};

export function useAIProviders(params: UseAIProvidersParams) {
  const query = useQuery({
    queryKey: aiModelsKey.list(params),

    queryFn: async () => {
      const [providersResponse, modelsResponse] = await Promise.all([
        getAIProviders({ enabled: params.enabled }),
        params.includeAIModels
          ? getAIModels({})
          : Promise.resolve({ success: true, data: [], errorMessage: null }),
      ]);

      if (!providersResponse.success) {
        Logger.scope(LOG_SCOPE).error(
          providersResponse.errorMessage ?? "Failed to fetch providers",
        );
        throw new Error(providersResponse.errorMessage ?? "Failed to fetch providers");
      }

      if (!modelsResponse.success) {
        Logger.scope(LOG_SCOPE).error(modelsResponse.errorMessage ?? "Failed to fetch models");
        throw new Error(modelsResponse.errorMessage ?? "Failed to fetch models");
      }

      return providersResponse.data.map((provider) => ({
        ...provider,
        models: modelsResponse.data.filter((model) => model.providerId === provider.providerId),
      }));
    },
  });

  return {
    providers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

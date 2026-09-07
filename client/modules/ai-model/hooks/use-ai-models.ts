import { useQuery } from "@tanstack/react-query";
import Logger from "electron-log/renderer.js";
import { useEffect, useState } from "react";
import { getModels } from "../api/ai-model.api";
import { aiModelsKey } from "../query-key/ai-model.key";
import type { AIModel } from "../types/ai-model.type";

const LOG_SCOPE = "useAiModels";
export type UseAiModelsParams = {
  enabled?: boolean;
  search?: string;
  provider?: string;
};

export function useAiModels(params: UseAiModelsParams) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: response, refetch } = useQuery({
    queryKey: aiModelsKey.list(params),
    queryFn: () =>
      getModels({
        enabled: params.enabled,
        search: params.search,
        provider: params.provider,
      }),
  });
  useEffect(() => {
    if (!response) return;
    if (!response.success) {
      Logger.scope(LOG_SCOPE).error(response.errorMessage ?? "Unknown error");
      setError(new Error(response.errorMessage ?? "Unknown error"));
      return;
    }

    setModels(response.data);
    setIsLoading(false);
  }, [response]);
  return { models, isLoading, error, refetch };
}

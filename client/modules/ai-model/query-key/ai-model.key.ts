import type { UseAIModelsParams } from "../hooks/use-ai-models";
import type { UseAIProvidersParams } from "../hooks/use-ai-providers";

export const aiProvidersKey = {
  all: ["ai-providers"] as const,

  lists: () => [...aiProvidersKey.all, "list"] as const,

  list: (params: UseAIProvidersParams) => [...aiProvidersKey.lists(), params] as const,
};

export const aiModelsKey = {
  all: ["ai-models"] as const,

  lists: () => [...aiModelsKey.all, "list"] as const,

  list: (params: UseAIModelsParams) => [...aiModelsKey.lists(), params] as const,
};

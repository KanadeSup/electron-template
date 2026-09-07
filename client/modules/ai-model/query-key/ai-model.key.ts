import type { UseAiModelsParams } from "../hooks/use-ai-models";

export const aiModelsKey = {
  all: ["ai-models"] as const,

  lists: () => [...aiModelsKey.all, "list"] as const,

  list: (params: UseAiModelsParams) => [...aiModelsKey.lists(), params] as const,
};

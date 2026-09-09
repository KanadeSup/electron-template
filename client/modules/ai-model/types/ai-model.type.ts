import type { GetAIModelsResponse } from "@shared/contracts/ai-model.contract";
import type { GetAIProvidersResponse } from "@shared/contracts/ai-provider.contract";

export type AIProvider = GetAIProvidersResponse[number];

export type AIModel = GetAIModelsResponse[number];

export type AIProviderWithModels = AIProvider & {
  models: AIModel[];
};

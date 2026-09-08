import type {
  GetAIModelsResponse,
  GetAIProvidersResponse,
} from "@shared/contracts/ai-model.contract";

export type AIProvider = GetAIProvidersResponse[number];

export type AIModel = GetAIModelsResponse[number];

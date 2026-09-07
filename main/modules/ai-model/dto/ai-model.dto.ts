import type { AIProviderId } from "@shared/ai-model/types/ai-model.type";

export type GetAIModelsInputDto = {
  provider?: AIProviderId;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsOutputDto = {
  id: string;
  enabled: boolean;
}[];

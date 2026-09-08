import type { ChangePositionDirection } from "@shared/contracts/ai-model.contract";

export type AIModelOutputDto = {
  id: number;
  modelId: string;
  enabled: boolean;
  providerId: string;
  sortOrder: number;
};

export type AIProviderOutputDto = {
  id: number;
  providerId: string;
  providerName: string;
  enabled: boolean;
  sortOrder: number;
};

export type SortOrderItemDto = {
  id: number;
  sortOrder: number;
};

// ========== Get AI models ==============

export type GetAIModelsInputDto = {
  providerId?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsOutputDto = AIModelOutputDto[];

// ========== Update AI model ==============
export type UpdateAIModelInputDto = {
  id: number;
  modelId?: string;
  enabled?: boolean;
};

// ========== Change AI model position ==============
export type ChangeAIModelPositionInputDto = {
  id: number;
  direction: ChangePositionDirection;
};

// ========== Delete AI model ==============
export type DeleteAIModelInputDto = {
  id: number;
};

// ========== Get AI providers ==============
export type GetAIProviderInputDto = {
  enabled?: boolean;
};

export type GetAIProvidersOutputDto = AIProviderOutputDto[];

// ========== Update AI provider ==============
export type UpdateAIProviderInputDto = {
  id: number;
  enabled?: boolean;
  apiKey?: string;
};

// ========== Change AI provider position ==============
export type ChangeAIProviderPositionInputDto = {
  id: number;
  direction: ChangePositionDirection;
};

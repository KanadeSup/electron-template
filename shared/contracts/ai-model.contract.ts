export type AIProvider = {
  id: number;
  providerId: string;
  providerName: string;
  enabled: boolean;
  apiKey: string;
  sortOrder: number;
};

export type AIModel = {
  id: number;
  modelId: string;
  enabled: boolean;
  providerId: string;
  sortOrder: number;
};

export type ChangePositionDirection = "up" | "down";

// ========== Get AI providers ==============
export const GET_AIPROVIDERS_CHANNEL_NAME = "get-ai-providers" as const;

export type GetAIProvidersRequest = {
  enabled?: boolean;
};

export type GetAIProvidersResponse = AIProvider[];

// ========== Update AI provider ==============

export const UPDATE_AIPROVIDER_CHANNEL_NAME = "update-ai-provider" as const;

export type UpdateAIProviderRequest = {
  id: number;
  enabled?: boolean;
  apiKey?: string;
};

export type UpdateAIProviderResponse = AIProvider;

// ========== Change AI provider position ==============
export const CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME = "change-ai-provider-position" as const;

export type ChangeAIProviderPositionRequest = {
  id: number;
  direction: ChangePositionDirection;
};

export type ChangeAIProviderPositionResponse = null;

// ========== Get AI models ==============
export const GET_AIMODELS_CHANNEL_NAME = "get-ai-models" as const;

export type GetAIModelsRequest = {
  providerId?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsResponse = AIModel[];

// ========== Update AI model ==============
export const UPDATE_AIMODEL_CHANNEL_NAME = "update-ai-model" as const;

export type UpdateAIModelRequest = {
  id: number;
  modelId?: string;
  enabled?: boolean;
};

export type UpdateAIModelResponse = AIModel;

// ========== Change AI model position ==============
export const CHANGE_AIMODEL_POSITION_CHANNEL_NAME = "change-ai-model-position" as const;

export type ChangeAIModelPositionRequest = {
  id: number;
  direction: ChangePositionDirection;
};

export type ChangeAIModelPositionResponse = null;

// ========== Delete AI model ==============
export const DELETE_AIMODEL_CHANNEL_NAME = "delete-ai-model" as const;

export type DeleteAIModelRequest = {
  id: number;
};

export type DeleteAIModelResponse = null;

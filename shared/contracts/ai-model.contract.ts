// ========== AI providers ==============
export const GET_AIPROVIDERS_CHANNEL_NAME = "get-ai-providers" as const;

export type GetAIProvidersRequest = {
  enabled?: boolean;
};

export type GetAIProvidersResponse = {
  id: number;
  providerId: string;
  providerName: string;
  enabled: boolean;
  sortOrder: number;
}[];

// ========== AI models ==============
export const GET_AIMODELS_CHANNEL_NAME = "get-ai-models" as const;

export type GetAIModelsRequest = {
  providerId?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsResponse = {
  id: number;
  modelId: string;
  enabled: boolean;
  providerId: string;
  sortOrder: number;
}[];

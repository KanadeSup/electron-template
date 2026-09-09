export type AIProvider = {
  id: number;
  providerName: string;
  providerLabel: string;
  enabled: boolean;
  apiKey: string;
  sortOrder: number;
};

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
  direction: "up" | "down";
};

export type ChangeAIProviderPositionResponse = null;

// ========== Validate API key ==============
export const CHECK_API_KEY_CHANNEL_NAME = "check-api-key" as const;

export type CheckAPIKeyRequest = {
  providerId: string;
  apiKey: string;
};

export type CheckAPIKeyResponse = {
  valid: boolean;
  message: string | null;
};

// ========== Fetch model by provider ==============
export const FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME = "fetch-model-by-provider" as const;

export type FetchModelByProviderRequest = {
  providerId: number;
};

export type FetchModelByProviderResponse = {
  modelName: string;
}[];

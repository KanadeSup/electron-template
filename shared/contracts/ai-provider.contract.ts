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
  providerId: string;
};

export type FetchModelByProviderResponse = {
  modelId: string;
}[];

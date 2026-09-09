export type AIProviderOutputDto = {
  id: number;
  providerName: string;
  providerLabel: string;
  enabled: boolean;
  apiKey: string;
  sortOrder: number;
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
  direction: "up" | "down";
};

export type GetAIModelsInputDto = {
  providerId?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsOutputDto = {
  id: number;
  modelId: string;
  enabled: boolean;
  providerId: string;
  sortOrder: number;
}[];

export type AIProviderInputDto = {
  enabled?: boolean;
};

export type AIProviderOutputDto = {
  id: number;
  providerId: string;
  providerName: string;
  enabled: boolean;
  sortOrder: number;
};

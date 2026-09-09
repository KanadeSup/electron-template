export type AIModelOutputDto = {
  id: number;
  modelName: string;
  enabled: boolean;
  providerId: number;
  providerName: string;
  sortOrder: number;
};

// ========== Get AI models ==============
export type GetAIModelsInputDto = {
  providerName?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsOutputDto = AIModelOutputDto[];

// ========== Update AI model ==============
export type UpdateAIModelInputDto = {
  id: number;
  modelName?: string;
  enabled?: boolean;
};

// ========== Change AI model position ==============
export type ChangeAIModelPositionInputDto = {
  id: number;
  direction: "up" | "down";
};

// ========== Delete AI model ==============
export type DeleteAIModelInputDto = {
  id: number;
};

// ========== Fetch model by provider ==============
export type FetchModelByProviderOutputDto = {
  modelName: string;
}[];

// ========== Create AI model ==============
export type CreateAIModelInputDto = {
  modelName: string;
  providerId: number;
};

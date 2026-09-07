export type GetAIModelsInputDto = {
  provider?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsOutputDto = {
  id: string;
  enabled: boolean;
  provider: string;
}[];

export const GET_AIMODELS_CHANNEL_NAME = "get-ai-models" as const;

export type GetAIModelsRequest = {
  provider?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsResponse = {
  id: string;
  enabled: boolean;
  provider: string;
}[];

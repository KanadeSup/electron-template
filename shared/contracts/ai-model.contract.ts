export type AIModel = {
  id: number;
  modelName: string;
  enabled: boolean;
  sortOrder: number;
  providerId: number;
};

// ========== Get AI models ==============
export const GET_AIMODELS_CHANNEL_NAME = "get-ai-models" as const;

export type GetAIModelsRequest = {
  providerName?: string;
  enabled?: boolean;
  search?: string;
};

export type GetAIModelsResponse = AIModel[];

// ========== Update AI model ==============
export const UPDATE_AIMODEL_CHANNEL_NAME = "update-ai-model" as const;

export type UpdateAIModelRequest = {
  id: number;
  modelName?: string;
  enabled?: boolean;
};

export type UpdateAIModelResponse = AIModel;

// ========== Change AI model position ==============
export const CHANGE_AIMODEL_POSITION_CHANNEL_NAME = "change-ai-model-position" as const;

export type ChangeAIModelPositionRequest = {
  id: number;
  direction: "up" | "down";
};

export type ChangeAIModelPositionResponse = null;

// ========== Delete AI model ==============
export const DELETE_AIMODEL_CHANNEL_NAME = "delete-ai-model" as const;

export type DeleteAIModelRequest = {
  id: number;
};

export type DeleteAIModelResponse = null;

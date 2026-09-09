import {
  CHANGE_AIMODEL_POSITION_CHANNEL_NAME,
  type ChangeAIModelPositionRequest,
  type ChangeAIModelPositionResponse,
  DELETE_AIMODEL_CHANNEL_NAME,
  type DeleteAIModelRequest,
  type DeleteAIModelResponse,
  GET_AIMODELS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
  UPDATE_AIMODEL_CHANNEL_NAME,
  type UpdateAIModelRequest,
  type UpdateAIModelResponse,
} from "@shared/contracts/ai-model.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { AIModelService } from "./services/ai-model.service";

export const getAIModelsChannel = createChannel<GetAIModelsRequest, GetAIModelsResponse>({
  name: GET_AIMODELS_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    return aiModelService.getAIModels(request);
  },
});

export const updateAIModelChannel = createChannel<UpdateAIModelRequest, UpdateAIModelResponse>({
  name: UPDATE_AIMODEL_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    return aiModelService.updateAIModel(request);
  },
});

export const changeAIModelPositionChannel = createChannel<
  ChangeAIModelPositionRequest,
  ChangeAIModelPositionResponse
>({
  name: CHANGE_AIMODEL_POSITION_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    aiModelService.changeAIModelPosition(request);
    return null;
  },
});

export const deleteAIModelChannel = createChannel<DeleteAIModelRequest, DeleteAIModelResponse>({
  name: DELETE_AIMODEL_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    aiModelService.deleteAIModel(request);
    return null;
  },
});

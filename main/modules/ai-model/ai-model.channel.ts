import {
  CHANGE_AIMODEL_POSITION_CHANNEL_NAME,
  CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME,
  type ChangeAIModelPositionRequest,
  type ChangeAIModelPositionResponse,
  type ChangeAIProviderPositionRequest,
  type ChangeAIProviderPositionResponse,
  DELETE_AIMODEL_CHANNEL_NAME,
  type DeleteAIModelRequest,
  type DeleteAIModelResponse,
  GET_AIMODELS_CHANNEL_NAME,
  GET_AIPROVIDERS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
  type GetAIProvidersRequest,
  type GetAIProvidersResponse,
  UPDATE_AIMODEL_CHANNEL_NAME,
  UPDATE_AIPROVIDER_CHANNEL_NAME,
  type UpdateAIModelRequest,
  type UpdateAIModelResponse,
  type UpdateAIProviderRequest,
  type UpdateAIProviderResponse,
} from "@shared/contracts/ai-model.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { AIModelService } from "./services/ai-model.service";

export const getAIProvidersChannel = createChannel<GetAIProvidersRequest, GetAIProvidersResponse>({
  name: GET_AIPROVIDERS_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    return aiModelService.getAIProviders(request);
  },
});

export const getAIModelsChannel = createChannel<GetAIModelsRequest, GetAIModelsResponse>({
  name: GET_AIMODELS_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    return aiModelService.getAIModels(request);
  },
});

export const updateAIProviderChannel = createChannel<
  UpdateAIProviderRequest,
  UpdateAIProviderResponse
>({
  name: UPDATE_AIPROVIDER_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    return aiModelService.updateAIProvider(request);
  },
});

export const changeAIProviderPositionChannel = createChannel<
  ChangeAIProviderPositionRequest,
  ChangeAIProviderPositionResponse
>({
  name: CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    await aiModelService.changeAIProviderPosition(request);
    return null;
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
    await aiModelService.changeAIModelPosition(request);
    return null;
  },
});

export const deleteAIModelChannel = createChannel<DeleteAIModelRequest, DeleteAIModelResponse>({
  name: DELETE_AIMODEL_CHANNEL_NAME,
  handle: async (request) => {
    const aiModelService = new AIModelService();
    await aiModelService.deleteAIModel(request);
    return null;
  },
});

import {
  GET_AIMODELS_CHANNEL_NAME,
  GET_AIPROVIDERS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
  type GetAIProvidersRequest,
  type GetAIProvidersResponse,
} from "@shared/contracts/ai-model.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { AIModelService } from "./services/ai-model.service";

export const getAIProvidersChannel = createChannel<GetAIProvidersRequest, GetAIProvidersResponse>({
  name: GET_AIPROVIDERS_CHANNEL_NAME,
  handle: async (request) => {
    const { enabled } = request;
    const aiModelService = new AIModelService();
    const providers = await aiModelService.getAIProviders({ enabled });
    return providers;
  },
});

export const getAIModelsChannel = createChannel<GetAIModelsRequest, GetAIModelsResponse>({
  name: GET_AIMODELS_CHANNEL_NAME,
  handle: async (request) => {
    const { providerId, enabled, search } = request;
    const aiModelService = new AIModelService();
    const models = await aiModelService.getAIModels({ providerId, enabled, search });
    return models;
  },
});

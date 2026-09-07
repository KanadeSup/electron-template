import {
  GET_AIMODELS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
} from "@shared/contracts/ai-model.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { AIModelService } from "./services/ai-model.service";

export const getAIModelsChannel = createChannel<GetAIModelsRequest, GetAIModelsResponse>({
  name: GET_AIMODELS_CHANNEL_NAME,
  handle: async (request) => {
    const { provider, enabled, search } = request;
    const aiModelService = new AIModelService();
    const models = await aiModelService.getAIModels({ provider, enabled, search });
    return models;
  },
});

import {
  CHECK_API_KEY_CHANNEL_NAME,
  type CheckAPIKeyRequest,
  type CheckAPIKeyResponse,
  FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME,
  type FetchModelByProviderRequest,
  type FetchModelByProviderResponse,
} from "@shared/contracts/ai-provider.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { LLMProviderFactory } from "../llm/factories/provider.factory";
import { AIModelService } from "./services/ai-model.service";

export const checkAPIKeyChannel = createChannel<CheckAPIKeyRequest, CheckAPIKeyResponse>({
  name: CHECK_API_KEY_CHANNEL_NAME,
  handle: async (request) => {
    const { providerId, apiKey } = request;
    const providerFactory = new LLMProviderFactory();
    const provider = providerFactory.getProvider(providerId, {});
    const validateResult = await provider.validateAPIKey(apiKey);
    return validateResult;
  },
});

export const fetchModelByProviderChannel = createChannel<
  FetchModelByProviderRequest,
  FetchModelByProviderResponse
>({
  name: FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME,
  handle: async (request) => {
    const { providerId } = request;
    const aiModelService = new AIModelService();
    const models = await aiModelService.fetchModelByProvider(providerId);
    return models;
  },
});

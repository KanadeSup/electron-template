import {
  CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME,
  CHECK_API_KEY_CHANNEL_NAME,
  type ChangeAIProviderPositionRequest,
  type ChangeAIProviderPositionResponse,
  type CheckAPIKeyRequest,
  type CheckAPIKeyResponse,
  FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME,
  type FetchModelByProviderRequest,
  type FetchModelByProviderResponse,
  GET_AIPROVIDERS_CHANNEL_NAME,
  type GetAIProvidersRequest,
  type GetAIProvidersResponse,
  UPDATE_AIPROVIDER_CHANNEL_NAME,
  type UpdateAIProviderRequest,
  type UpdateAIProviderResponse,
} from "@shared/contracts/ai-provider.contract";
import { createChannel } from "../common/ipc-channel/base-channel";
import { LLMClientFactory } from "../llm-client/factories/llm-client.factory";
import { AIModelService } from "./services/ai-model.service";
import { AIProviderService } from "./services/ai-provider.service";

export const getAIProvidersChannel = createChannel<GetAIProvidersRequest, GetAIProvidersResponse>({
  name: GET_AIPROVIDERS_CHANNEL_NAME,
  handle: async (request) => {
    const providerService = new AIProviderService();
    return providerService.getAIProviders(request);
  },
});

export const updateAIProviderChannel = createChannel<
  UpdateAIProviderRequest,
  UpdateAIProviderResponse
>({
  name: UPDATE_AIPROVIDER_CHANNEL_NAME,
  handle: async (request) => {
    const providerService = new AIProviderService();
    return providerService.updateAIProvider(request);
  },
});

export const changeAIProviderPositionChannel = createChannel<
  ChangeAIProviderPositionRequest,
  ChangeAIProviderPositionResponse
>({
  name: CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME,
  handle: async (request) => {
    const providerService = new AIProviderService();
    providerService.changeAIProviderPosition(request);
    return null;
  },
});

export const checkAPIKeyChannel = createChannel<CheckAPIKeyRequest, CheckAPIKeyResponse>({
  name: CHECK_API_KEY_CHANNEL_NAME,
  handle: async (request) => {
    const { providerId, apiKey } = request;
    const providerFactory = new LLMClientFactory();
    const provider = providerFactory.getClient(providerId, { apiKey });
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

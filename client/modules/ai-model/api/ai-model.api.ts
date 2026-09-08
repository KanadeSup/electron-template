import { invoke } from "@client/modules/design-system/api/ipc-base";
import {
  GET_AIMODELS_CHANNEL_NAME,
  GET_AIPROVIDERS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
  type GetAIProvidersRequest,
  type GetAIProvidersResponse,
} from "@shared/contracts/ai-model.contract";

export async function getAIModels(params: GetAIModelsRequest) {
  const resp = await invoke<GetAIModelsRequest, GetAIModelsResponse>(
    GET_AIMODELS_CHANNEL_NAME,
    params,
  );
  return resp;
}

export async function getAIProviders(params: GetAIProvidersRequest) {
  const resp = await invoke<GetAIProvidersRequest, GetAIProvidersResponse>(
    GET_AIPROVIDERS_CHANNEL_NAME,
    params,
  );
  return resp;
}

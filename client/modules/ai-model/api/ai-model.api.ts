import { invoke } from "@client/modules/design-system/api/ipc-base";
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
import {
  CHECK_API_KEY_CHANNEL_NAME,
  type CheckAPIKeyRequest,
  type CheckAPIKeyResponse,
  FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME,
  type FetchModelByProviderRequest,
  type FetchModelByProviderResponse,
} from "@shared/contracts/ai-provider.contract";

export async function getAIModels(params: GetAIModelsRequest) {
  return invoke<GetAIModelsRequest, GetAIModelsResponse>(GET_AIMODELS_CHANNEL_NAME, params);
}

export async function getAIProviders(params: GetAIProvidersRequest) {
  return invoke<GetAIProvidersRequest, GetAIProvidersResponse>(
    GET_AIPROVIDERS_CHANNEL_NAME,
    params,
  );
}

export async function updateAIProvider(params: UpdateAIProviderRequest) {
  return invoke<UpdateAIProviderRequest, UpdateAIProviderResponse>(
    UPDATE_AIPROVIDER_CHANNEL_NAME,
    params,
  );
}

export async function changeAIProviderPosition(params: ChangeAIProviderPositionRequest) {
  return invoke<ChangeAIProviderPositionRequest, ChangeAIProviderPositionResponse>(
    CHANGE_AIPROVIDER_POSITION_CHANNEL_NAME,
    params,
  );
}

export async function updateAIModel(params: UpdateAIModelRequest) {
  return invoke<UpdateAIModelRequest, UpdateAIModelResponse>(UPDATE_AIMODEL_CHANNEL_NAME, params);
}

export async function changeAIModelPosition(params: ChangeAIModelPositionRequest) {
  return invoke<ChangeAIModelPositionRequest, ChangeAIModelPositionResponse>(
    CHANGE_AIMODEL_POSITION_CHANNEL_NAME,
    params,
  );
}

export async function deleteAIModel(params: DeleteAIModelRequest) {
  return invoke<DeleteAIModelRequest, DeleteAIModelResponse>(DELETE_AIMODEL_CHANNEL_NAME, params);
}

export async function checkAPIKey(params: CheckAPIKeyRequest) {
  return invoke<CheckAPIKeyRequest, CheckAPIKeyResponse>(CHECK_API_KEY_CHANNEL_NAME, params);
}

export async function fetchModelsByProvider(params: FetchModelByProviderRequest) {
  return invoke<FetchModelByProviderRequest, FetchModelByProviderResponse>(
    FETCH_MODEL_BY_PROVIDER_CHANNEL_NAME,
    params,
  );
}

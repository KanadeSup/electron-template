import { invoke } from "@client/modules/design-system/api/ipc-base";
import {
  GET_AIMODELS_CHANNEL_NAME,
  type GetAIModelsRequest,
  type GetAIModelsResponse,
} from "@shared/contracts/ai-model.contract";

export type GetModelsParams = {
  enabled?: boolean;
  search?: string;
  provider?: string;
};
export async function getModels(params: GetModelsParams) {
  const resp = await invoke<GetAIModelsRequest, GetAIModelsResponse>(GET_AIMODELS_CHANNEL_NAME, {
    enabled: params.enabled,
    search: params.search,
    provider: params.provider,
  });
  return resp;
}

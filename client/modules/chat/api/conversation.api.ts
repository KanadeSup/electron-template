import { invoke } from "@client/modules/design-system/api/ipc-base";
import {
  CREATE_CONVERSATION_CHANNEL_NAME,
  type CreateConversationRequest,
  type CreateConversationResponse,
  DELETE_CONVERSATION_CHANNEL_NAME,
  type DeleteConversationRequest,
  type DeleteConversationResponse,
  GET_CONVERSATION_BY_ID_CHANNEL_NAME,
  GET_CONVERSATION_LIST_CHANNEL_NAME,
  type GetConversationByIdRequest,
  type GetConversationByIdResponse,
  type GetConversationListRequest,
  type GetConversationListResponse,
} from "@shared/contracts/conversation.contract";

export async function getConversationList() {
  return invoke<GetConversationListRequest, GetConversationListResponse>(
    GET_CONVERSATION_LIST_CHANNEL_NAME,
    null,
  );
}

export async function getConversationById(params: GetConversationByIdRequest) {
  return invoke<GetConversationByIdRequest, GetConversationByIdResponse>(
    GET_CONVERSATION_BY_ID_CHANNEL_NAME,
    params,
  );
}

export async function createConversation(params: CreateConversationRequest) {
  return invoke<CreateConversationRequest, CreateConversationResponse>(
    CREATE_CONVERSATION_CHANNEL_NAME,
    params,
  );
}

export async function deleteConversation(params: DeleteConversationRequest) {
  return invoke<DeleteConversationRequest, DeleteConversationResponse>(
    DELETE_CONVERSATION_CHANNEL_NAME,
    params,
  );
}

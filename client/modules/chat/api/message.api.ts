import { invoke, onIpc } from "@client/modules/design-system/api/ipc-base";
import {
  CREATE_MESSAGE_CHANNEL_NAME,
  type CreateMessageRequest,
  type CreateMessageResponse,
  DELETE_MESSAGE_CHANNEL_NAME,
  type DeleteMessageRequest,
  type DeleteMessageResponse,
  GET_MESSAGE_BY_ID_CHANNEL_NAME,
  GET_MESSAGE_LIST_CHANNEL_NAME,
  type GetMessageByIdRequest,
  type GetMessageByIdResponse,
  type GetMessageListRequest,
  type GetMessageListResponse,
  type OnSendMessageEventResponse,
  SEND_MESSAGE_CHANNEL_NAME,
  SEND_MESSAGE_EVENT_NAME,
  type SendMessageRequest,
  type SendMessageResponse,
  UPDATE_MESSAGE_CHANNEL_NAME,
  type UpdateMessageRequest,
  type UpdateMessageResponse,
} from "@shared/contracts/message.contract";

export async function getMessageList(params: GetMessageListRequest) {
  return invoke<GetMessageListRequest, GetMessageListResponse>(
    GET_MESSAGE_LIST_CHANNEL_NAME,
    params,
  );
}

export async function getMessageById(params: GetMessageByIdRequest) {
  return invoke<GetMessageByIdRequest, GetMessageByIdResponse>(
    GET_MESSAGE_BY_ID_CHANNEL_NAME,
    params,
  );
}

export async function createMessage(params: CreateMessageRequest) {
  return invoke<CreateMessageRequest, CreateMessageResponse>(CREATE_MESSAGE_CHANNEL_NAME, params);
}

export async function updateMessage(params: UpdateMessageRequest) {
  return invoke<UpdateMessageRequest, UpdateMessageResponse>(UPDATE_MESSAGE_CHANNEL_NAME, params);
}

export async function deleteMessage(params: DeleteMessageRequest) {
  return invoke<DeleteMessageRequest, DeleteMessageResponse>(DELETE_MESSAGE_CHANNEL_NAME, params);
}

export async function sendMessage(params: SendMessageRequest) {
  return invoke<SendMessageRequest, SendMessageResponse>(SEND_MESSAGE_CHANNEL_NAME, params);
}

export function onSendMessageEvent(listener: (response: OnSendMessageEventResponse) => void) {
  onIpc<OnSendMessageEventResponse>(
    SEND_MESSAGE_EVENT_NAME,
    (_, response: OnSendMessageEventResponse) => listener(response),
  );
  return () => {
    window.electron.ipcRenderer.removeAllListeners(SEND_MESSAGE_EVENT_NAME);
  };
}

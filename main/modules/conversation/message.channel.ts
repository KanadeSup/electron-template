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
  UPDATE_MESSAGE_CHANNEL_NAME,
  type UpdateMessageRequest,
  type UpdateMessageResponse,
} from "@shared/contracts/message.contract";
import { NotFoundError } from "../common/errors/common.error";
import { createChannel } from "../common/ipc-channel/base-channel";
import { MessageService } from "./services/message.service";

export const getMessageListChannel = createChannel<GetMessageListRequest, GetMessageListResponse>({
  name: GET_MESSAGE_LIST_CHANNEL_NAME,
  handle: async (request) => {
    const messageService = new MessageService();
    const messages = messageService.getMessageListByConversationId(request.conversationId);

    return messages.map((message) => ({
      id: message.id,
      type: message.type,
      content: message.content,
      createdAt: new Date(message.createdAt).toISOString(),
      updatedAt: new Date(message.updatedAt).toISOString(),
    }));
  },
});

export const getMessageByIdChannel = createChannel<GetMessageByIdRequest, GetMessageByIdResponse>({
  name: GET_MESSAGE_BY_ID_CHANNEL_NAME,
  handle: async (request) => {
    const messageService = new MessageService();
    const message = messageService.getMessageById(request.messageId);

    if (!message) throw new NotFoundError("Message not found");

    return {
      id: message.id,
      type: message.type,
      content: message.content,
      createdAt: new Date(message.createdAt).toISOString(),
      updatedAt: new Date(message.updatedAt).toISOString(),
    };
  },
});

export const createMessageChannel = createChannel<CreateMessageRequest, CreateMessageResponse>({
  name: CREATE_MESSAGE_CHANNEL_NAME,
  handle: async (request) => {
    const messageService = new MessageService();
    const messageId = messageService.createMessage({
      conversationId: request.conversationId,
      type: request.type,
      content: request.content,
    });

    return {
      messageId,
    };
  },
});

export const updateMessageChannel = createChannel<UpdateMessageRequest, UpdateMessageResponse>({
  name: UPDATE_MESSAGE_CHANNEL_NAME,
  handle: async (request) => {
    const messageService = new MessageService();
    const updated = messageService.updateMessage(request.messageId, request.updateData);
    if (!updated) throw new NotFoundError("Message not found");
    return null;
  },
});

export const deleteMessageChannel = createChannel<DeleteMessageRequest, DeleteMessageResponse>({
  name: DELETE_MESSAGE_CHANNEL_NAME,
  handle: async (request) => {
    const messageService = new MessageService();
    const deleted = messageService.deleteMessage(request.messageId);
    if (!deleted) throw new NotFoundError("Message not found");

    return null;
  },
});

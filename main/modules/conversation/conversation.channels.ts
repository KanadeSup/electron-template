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
import { NotFoundError } from "../common/errors/common.error";
import { createChannel } from "../common/ipc-channel/base-channel";
import { ConversationService } from "./services/conversation.service";

export const getConversationListChannel = createChannel<
  GetConversationListRequest,
  GetConversationListResponse
>({
  name: GET_CONVERSATION_LIST_CHANNEL_NAME,
  handle: async () => {
    const conversationService = new ConversationService();
    const conversations = conversationService.getConversationList();

    return conversations.map((conversation) => ({
      id: conversation.id,
      name: conversation.name,
      createdAt: new Date(conversation.createdAt).toISOString(),
      updatedAt: new Date(conversation.updatedAt).toISOString(),
    }));
  },
});

export const getConversationByIdChannel = createChannel<
  GetConversationByIdRequest,
  GetConversationByIdResponse
>({
  name: GET_CONVERSATION_BY_ID_CHANNEL_NAME,
  handle: async (request) => {
    const conversationService = new ConversationService();
    const conversation = conversationService.getConversationById(request.conversationId);

    if (!conversation) throw new NotFoundError("Conversation not found");

    return {
      id: conversation.id,
      name: conversation.name,
      model: conversation.model ?? "",
      messages: conversation.messages.map((message) => ({
        id: message.id,
        type: message.type,
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
        updatedAt: new Date(message.updatedAt).toISOString(),
      })),
      createdAt: new Date(conversation.createdAt).toISOString(),
      updatedAt: new Date(conversation.updatedAt).toISOString(),
    };
  },
});

export const createConversationChannel = createChannel<
  CreateConversationRequest,
  CreateConversationResponse
>({
  name: CREATE_CONVERSATION_CHANNEL_NAME,
  handle: async (request) => {
    const conversationService = new ConversationService();
    const conversationId = conversationService.createConversation({
      name: request.name,
      model: request.model,
    });

    return {
      conversationId,
    };
  },
});

export const deleteConversationChannel = createChannel<
  DeleteConversationRequest,
  DeleteConversationResponse
>({
  name: DELETE_CONVERSATION_CHANNEL_NAME,
  handle: async (request) => {
    const conversationService = new ConversationService();
    const deleted = conversationService.deleteConversation({
      conversationId: request.conversationId,
    });
    if (!deleted) throw new NotFoundError("Conversation not found");
    return null;
  },
});

import type { ConversationMessage } from "./message.contract";

// Get conversation list channel
export const GET_CONVERSATION_LIST_CHANNEL_NAME = "get-conversation-list";
export type GetConversationListRequest = null;

export type GetConversationListResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}[];

// Get conversation by id channel
export const GET_CONVERSATION_BY_ID_CHANNEL_NAME = "get-conversation-by-id";
export type GetConversationByIdRequest = {
  conversationId: number;
};

export type GetConversationByIdResponse = {
  id: number;
  name: string;
  model: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
};

// Create a new conversation channel
export const CREATE_CONVERSATION_CHANNEL_NAME = "create-conversation";
export type CreateConversationRequest = null;

export type CreateConversationResponse = {
  conversationId: number;
};

// Delete a conversation channel
export const DELETE_CONVERSATION_CHANNEL_NAME = "delete-conversation";
export type DeleteConversationRequest = {
  conversationId: number;
};

export type DeleteConversationResponse = null;

// Send message channel
export const SEND_MESSAGE_CHANNEL_NAME = "send-message";

export type SendMessageRequest = {
  conversationId: number;
  message: string;
  model: string;
};

export type SendMessageResponse = null;

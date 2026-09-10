import type { ConversationMessageType } from "@main/modules/conversation/types/conversation.type";

export type ConversationMessage = {
  id: number;
  type: ConversationMessageType;
  content: string;
  errorMessage?: string | null;
  errorCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Get message list by conversation id channel
export const GET_MESSAGE_LIST_CHANNEL_NAME = "get-message-list";
export type GetMessageListRequest = {
  conversationId: number;
};

export type GetMessageListResponse = ConversationMessage[];

// Get message by id channel
export const GET_MESSAGE_BY_ID_CHANNEL_NAME = "get-message-by-id";
export type GetMessageByIdRequest = {
  messageId: number;
};

export type GetMessageByIdResponse = ConversationMessage;

// Create message channel
export const CREATE_MESSAGE_CHANNEL_NAME = "create-message";
export type CreateMessageRequest = {
  conversationId: number;
  type: ConversationMessageType;
  content: string;
  errorMessage?: string | null;
  errorCode?: string | null;
};

export type CreateMessageResponse = {
  messageId: number;
};

// Update message channel
export const UPDATE_MESSAGE_CHANNEL_NAME = "update-message";
export type UpdateMessageRequest = {
  messageId: number;
  updateData: {
    content?: string;
    errorMessage?: string | null;
    errorCode?: string | null;
  };
};

export type UpdateMessageResponse = null;

// Delete message channel
export const DELETE_MESSAGE_CHANNEL_NAME = "delete-message";
export type DeleteMessageRequest = {
  messageId: number;
};

export type DeleteMessageResponse = null;

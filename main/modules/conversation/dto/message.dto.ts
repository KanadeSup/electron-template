import type { ConversationMessageType } from "../types/conversation.type";

export type ConversationMessageDto = {
  id: number;
  type: ConversationMessageType;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMessageInputDto = {
  conversationId: number;
  type: ConversationMessageType;
  content: string;
};

export type UpdateMessageInputDto = {
  content?: string;
};

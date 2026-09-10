import type { ConversationMessageType } from "../types/conversation.type";

export type ConversationMessageDto = {
  id: number;
  type: ConversationMessageType;
  content: string;
  errorMessage?: string | null;
  errorCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMessageInputDto = {
  conversationId: number;
  type: ConversationMessageType;
  content?: string;
  errorMessage?: string | null;
  errorCode?: string | null;
};

export type UpdateMessageInputDto = {
  content?: string;
  errorMessage?: string | null;
  errorCode?: string | null;
};

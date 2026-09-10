import type { ConversationMessageDto } from "./message.dto";

export type ConversationDto = {
  id: number;
  name: string;
  model: string | null;
  history: string | null;
  messages: ConversationMessageDto[];
  createdAt: string;
  updatedAt: string;
};

// Conversation list DTO
export type ConversationListItemDto = Omit<ConversationDto, "history" | "messages">;

// Create conversation DTO
export type CreateConversationInputDto = {
  name?: string;
  model?: string;
  history?: string;
};

// Update conversation DTO
export type UpdateConversationInputDto = {
  name?: string;
  model?: string;
  history?: string;
};

export type GetConversationByIdInputDto = {
  conversationId: number;
};

export type DeleteConversationInputDto = {
  conversationId: number;
};

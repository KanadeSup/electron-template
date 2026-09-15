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

// Send message channel
export const SEND_MESSAGE_CHANNEL_NAME = "send-message";

export enum SendMessageEventErrorCodeEnum {
  MODEL_NOT_FOUND = "model-not-found",
  API_KEY_NOT_FOUND = "api-key-not-found",
  CONVERSATION_NOT_FOUND = "conversation-not-found",
}

export type SendMessageEventErrorCode = `${SendMessageEventErrorCodeEnum}`;

export type SendMessageRequest = {
  conversationId: number;
  message: string;
  model: string;
};

export type SendMessageResponse = null;

export const SEND_MESSAGE_EVENT_NAME = "client:send-message-event";

export type OnSendMessageEventResponse =
  | {
      conversationId: number;
      type: "event.start";
    }
  | {
      conversationId: number;
      type: "error";
      content: ErrorSendMessageResponse;
    }
  | {
      conversationId: number;
      type: "user-message.created";
      content: BaseSendMessageResponse<"user">;
    }
  | {
      conversationId: number;
      type: "thinking.start";
    }
  | {
      conversationId: number;
      type: "thinking.delta";
      content: string;
    }
  | {
      conversationId: number;
      type: "thinking.end";
      content: BaseSendMessageResponse<"think"> | null;
    }
  | {
      conversationId: number;
      type: "model-output.start";
    }
  | {
      conversationId: number;
      type: "model-output.delta";
      content: string;
    }
  | {
      conversationId: number;
      type: "model-output.end";
      content: BaseSendMessageResponse<"assistant">;
    }
  | {
      conversationId: number;
      type: "event.end";
      data: {
        inputTokens?: number;
        outputTokens?: number;
        thinkingTokens?: number;
      };
    };

export type BaseSendMessageResponse<TType extends Omit<ConversationMessageType, "error">> = {
  id: number;
  type: TType;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ErrorSendMessageResponse = {
  id: number;
  type: "error";
  errorMessage?: string | null;
  errorCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

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
  SendMessageEventErrorCodeEnum,
  type SendMessageRequest,
  type SendMessageResponse,
  UPDATE_MESSAGE_CHANNEL_NAME,
  type UpdateMessageRequest,
  type UpdateMessageResponse,
} from "@shared/contracts/message.contract";
import Logger from "electron-log";
import { AIModelService } from "../ai-model/services/ai-model.service";
import { NotFoundError } from "../common/errors/common.error";
import { createChannel, createSenderChannel } from "../common/ipc-channel/base-channel";
import { LLMClientFactory } from "../llm-client/factories/llm-client.factory";
import { ConversationService } from "./services/conversation.service";
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
    const message = messageService.createMessage({
      conversationId: request.conversationId,
      type: request.type,
      content: request.content,
    });

    return {
      messageId: message.id,
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

export const sendMessageChannel = createSenderChannel<SendMessageRequest, SendMessageResponse>({
  name: SEND_MESSAGE_CHANNEL_NAME,
  handle: async (sender, request) => {
    const SEND_MESSAGE_CHANNEL_SCOPE = "sendMessageChannel";
    const messageService = new MessageService();
    const modelService = new AIModelService();
    const conversationService = new ConversationService();
    const dispatchErrorAndEnd = (
      errorMessageStr: string,
      errorCode?: SendMessageEventErrorCodeEnum,
    ) => {
      const errorMessage = messageService.createMessage({
        conversationId: request.conversationId,
        type: "error",
        errorMessage: errorMessageStr,
        errorCode: errorCode,
      });

      sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
        conversationId: request.conversationId,
        type: "error",
        content: {
          id: errorMessage.id,
          type: "error",
          errorMessage: errorMessage.errorMessage,
          errorCode: errorMessage.errorCode,
          createdAt: errorMessage.createdAt,
          updatedAt: errorMessage.updatedAt,
        },
      });
      sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
        conversationId: request.conversationId,
        type: "event.end",
        data: {},
      });
    };

    try {
      sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
        conversationId: request.conversationId,
        type: "event.start",
      });

      const model = modelService.getAIModelByName(request.model);
      if (!model) {
        dispatchErrorAndEnd("Model not found", SendMessageEventErrorCodeEnum.MODEL_NOT_FOUND);
        return null;
      }

      const llmClient = new LLMClientFactory().getClient(model.providerName, {});
      if (!llmClient.getApiKey()) {
        dispatchErrorAndEnd("API key not found", SendMessageEventErrorCodeEnum.API_KEY_NOT_FOUND);
        return null;
      }

      // Save recent model
      conversationService.updateConversation(request.conversationId, {
        model: request.model,
      });

      // Create user message
      const userMessage = messageService.createMessage({
        conversationId: request.conversationId,
        type: "user",
        content: request.message,
      });
      sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
        conversationId: request.conversationId,
        type: "user-message.created",
        content: {
          id: userMessage.id,
          type: "user",
          content: userMessage.content,
          createdAt: userMessage.createdAt,
          updatedAt: userMessage.updatedAt,
        },
      });

      const conversation = conversationService.getConversationById(request.conversationId);
      if (!conversation) {
        dispatchErrorAndEnd(
          "Conversation not found",
          SendMessageEventErrorCodeEnum.CONVERSATION_NOT_FOUND,
        );
        return null;
      }

      const history = conversation.history ? JSON.parse(conversation.history) : [];

      // Stream events from LLM client
      const stream = llmClient.generateTextStream(userMessage.content, {
        model: model.modelName,
        history: history,
      });
      let thinkingContent = "";
      let modelOutputContent = "";
      for await (const event of stream) {
        switch (event.type) {
          case "thinking.start":
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "thinking.start",
            });
            break;
          case "thinking.delta":
            thinkingContent += event.text;
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "thinking.delta",
              content: event.text,
            });
            break;
          case "thinking.end":
            // If thinking content is empty, don't create a thinking message
            if (thinkingContent.trim()) {
              const thinkingMessage = messageService.createMessage({
                conversationId: request.conversationId,
                type: "think",
                content: thinkingContent,
              });
              sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
                conversationId: request.conversationId,
                type: "thinking.end",
                content: {
                  id: thinkingMessage.id,
                  type: "think",
                  content: thinkingMessage.content,
                  createdAt: thinkingMessage.createdAt,
                  updatedAt: thinkingMessage.updatedAt,
                },
              });
            } else {
              sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
                conversationId: request.conversationId,
                type: "thinking.end",
                content: null,
              });
            }
            break;
          case "model_output.start":
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "model-output.start",
            });
            break;
          case "model_output.delta":
            modelOutputContent += event.text;
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "model-output.delta",
              content: event.text,
            });
            break;
          case "model_output.end": {
            const assistantMessage = messageService.createMessage({
              conversationId: request.conversationId,
              type: "assistant",
              content: modelOutputContent,
            });
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "model-output.end",
              content: {
                id: assistantMessage.id,
                type: "assistant",
                content: assistantMessage.content,
                createdAt: assistantMessage.createdAt,
                updatedAt: assistantMessage.updatedAt,
              },
            });
            break;
          }
          case "interaction.completed": {
            sender<OnSendMessageEventResponse>(SEND_MESSAGE_EVENT_NAME, {
              conversationId: request.conversationId,
              type: "event.end",
              data: {
                inputTokens: event.inputTokens,
                outputTokens: event.outputTokens,
                thinkingTokens: event.thinkingTokens,
              },
            });
            const stringifiedHistory = JSON.stringify(event.history ?? []);
            conversationService.updateConversation(request.conversationId, {
              history: stringifiedHistory,
            });
            break;
          }
        }
      }
    } catch (error) {
      Logger.scope(SEND_MESSAGE_CHANNEL_SCOPE).error(
        "Something when wrong during processing send message request",
        error,
      );
      if (error instanceof Error && error.stack) {
        Logger.scope(SEND_MESSAGE_CHANNEL_SCOPE).error(error.stack);
      }

      dispatchErrorAndEnd(error instanceof Error ? error.message : "Unexpected error");
    }

    return null;
  },
});

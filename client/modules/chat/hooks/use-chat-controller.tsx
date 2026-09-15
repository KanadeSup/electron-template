import { toast } from "@client/modules/design-system/components/shadcn-ui/toast";
import type { ConversationMessage } from "@shared/contracts/message.contract";
import Logger from "electron-log";
import { useCallback, useEffect, useMemo } from "react";
import {
  createConversation as createConversationApi,
  getConversationById,
} from "../api/conversation.api";
import { onSendMessageEvent, sendMessage as sendMessageApi } from "../api/message.api";
import type { DisplayAssistantMessage, DisplayMessage } from "../types/message.type";
import { type ConversationMemory, useConversationMemories } from "./use-conversation-memories";

const SCOPE = "useChatController";

export type ChatControllerParams = {
  conversationId: number | null;
};

export type SendMessageOptions = {
  model: string;
};

export function useChatController(params: ChatControllerParams) {
  const { conversationId } = params;

  const { conversationMemories, conversationMemoriesRef, upsertConversationMemory } =
    useConversationMemories();

  const displayMessages = useMemo(() => {
    if (!conversationId) return [];
    return conversationMemories[conversationId]?.messages || [];
  }, [conversationMemories, conversationId]);

  const mostRecentlyModel = useMemo(() => {
    if (!conversationId) return null;
    return conversationMemories[conversationId]?.mostRecentlyModel || null;
  }, [conversationId, conversationMemories]);

  const isLoading = useMemo(() => {
    if (!conversationId) return false;
    return conversationMemories[conversationId]?.isReady === false;
  }, [conversationId, conversationMemories]);

  const createConversation = async (name: string, model: string) => {
    const response = await createConversationApi({ name, model });
    if (!response.success) {
      Logger.scope(SCOPE).error(response.errorMessage || "Error creating conversation");
      return null;
    }
    const conversationId = response.data.conversationId;

    // Create a new conversation memory to prevent
    // system from calling api to load the conversation
    upsertConversationMemory(conversationId, {
      isReady: true,
      messages: [],
      mostRecentlyModel: model,
    });

    return conversationId;
  };

  const sendMessage = async (
    conversationId: number,
    message: string,
    options: SendMessageOptions,
  ) => {
    const conversationMemory = conversationMemoriesRef.current[conversationId];
    if (!conversationMemory?.isReady) return;

    // Lock the conversation immediately and wait for
    // the streaming finish to unlock it
    upsertConversationMemory(conversationId, {
      isReady: false,
      messages: conversationMemory.messages,
      mostRecentlyModel: options.model,
    });

    const response = await sendMessageApi({
      conversationId,
      message,
      model: options.model,
    });

    if (!response.success) {
      // Unlock the conversation immediately if failed
      const currentMessages = conversationMemoriesRef.current[conversationId].messages;
      upsertConversationMemory(conversationId, {
        isReady: true,
        messages: currentMessages,
        mostRecentlyModel: options.model,
      });
      Logger.scope(SCOPE).error("Failed to send message", response.errorMessage);
      toast.add({
        type: "error",
        title: "Error sending message",
        description: "Please try again or check logs for more details.",
        priority: "high",
      });
      return;
    }
  };

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  useEffect(() => {
    // Load conversation when the conversationId changes
    async function loadConversation() {
      if (!conversationId) return;
      if (conversationMemoriesRef.current[conversationId]) return;
      const resp = await getConversationById({
        conversationId,
      });
      if (!resp.success) {
        Logger.scope(SCOPE).error("Error getting conversation", resp.errorMessage);
        toast.add({
          type: "error",
          title: "Error getting conversation",
          description: "Please try again or check logs for more details.",
          priority: "high",
        });
        return;
      }

      // Saved loaded messages to conversation memory
      const conversationMemory: ConversationMemory = {
        mostRecentlyModel: resp.data.model,
        isReady: true,
        messages: resp.data.messages
          .map((message) => toDisplayMessage(message))
          .filter((message) => message !== null),
      };
      upsertConversationMemory(conversationId, conversationMemory);
    }
    loadConversation();
  }, [conversationId, upsertConversationMemory]);

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  const addDisplayMessage = useCallback(
    (conversationId: number, message: DisplayMessage) => {
      const conversationMemory = conversationMemoriesRef.current[conversationId];
      if (!conversationMemory) return;

      upsertConversationMemory(conversationId, {
        mostRecentlyModel: conversationMemory.mostRecentlyModel,
        isReady: conversationMemory.isReady,
        messages: [...conversationMemory.messages, message],
      });
    },
    [upsertConversationMemory],
  );

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  const updateGeneratingMessage = useCallback(
    (
      conversationId: number,
      type: "assistant" | "think",
      message: DisplayAssistantMessage<"assistant" | "think">,
    ) => {
      const conversationMemory = conversationMemoriesRef.current[conversationId];
      if (!conversationMemory) return;

      const newMessages = conversationMemory.messages.map((m) => {
        if (m.type === type && m.isGenerating) {
          return { ...message };
        }
        return m;
      });
      upsertConversationMemory(conversationId, {
        isReady: conversationMemory.isReady,
        mostRecentlyModel: conversationMemory.mostRecentlyModel,
        messages: newMessages,
      });
    },
    [upsertConversationMemory],
  );

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  const appendContentToGeneratingMessage = useCallback(
    (conversationId: number, type: "assistant" | "think", chunk: string) => {
      const conversationMemory = conversationMemoriesRef.current[conversationId];
      if (!conversationMemory) return;

      const newMessages = conversationMemory.messages.map((m) => {
        if (m.type === type && m.isGenerating) {
          return { ...m, content: m.content + chunk };
        }
        return m;
      });
      upsertConversationMemory(conversationId, {
        isReady: conversationMemory.isReady,
        mostRecentlyModel: conversationMemory.mostRecentlyModel,
        messages: newMessages,
      });
    },
    [upsertConversationMemory],
  );

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  const removeGeneratingMessage = useCallback(
    (conversationId: number, type: "assistant" | "think") => {
      const conversationMemory = conversationMemoriesRef.current[conversationId];
      if (!conversationMemory) return;

      const newMessages = conversationMemory.messages.filter(
        (m) => m.type !== type || !m.isGenerating,
      );

      upsertConversationMemory(conversationId, {
        isReady: conversationMemory.isReady,
        mostRecentlyModel: conversationMemory.mostRecentlyModel,
        messages: newMessages,
      });
    },
    [upsertConversationMemory],
  );

  /*
   *  biome-ignore lint/correctness/useExhaustiveDependencies: conversationMemoriesRef is react ref object
   *  which is not necessary to be included in the dependencies array
   */
  useEffect(() => {
    const unsubscribe = onSendMessageEvent((response) => {
      const conversationMemory = conversationMemoriesRef.current[response.conversationId];
      if (!conversationMemory) return;

      switch (response.type) {
        case "event.start":
          break;
        case "user-message.created":
          addDisplayMessage(response.conversationId, {
            id: response.content.id,
            type: "user",
            content: response.content.content,
            createdAt: new Date(response.content.createdAt),
            updatedAt: new Date(response.content.updatedAt),
          });
          break;
        case "thinking.start":
          addDisplayMessage(response.conversationId, {
            type: "think",
            content: "",
            isGenerating: true,
          });
          break;
        case "thinking.delta":
          appendContentToGeneratingMessage(response.conversationId, "think", response.content);
          break;
        case "thinking.end":
          if (!response.content) {
            removeGeneratingMessage(response.conversationId, "think");
          } else {
            const data = response.content;
            updateGeneratingMessage(response.conversationId, "think", {
              id: data.id,
              type: "think",
              content: data.content,
              isGenerating: false,
              createdAt: new Date(data.createdAt),
              updatedAt: new Date(data.updatedAt),
            });
          }
          break;
        case "model-output.start":
          addDisplayMessage(response.conversationId, {
            type: "assistant",
            content: "",
            isGenerating: true,
          });
          break;
        case "model-output.delta":
          appendContentToGeneratingMessage(response.conversationId, "assistant", response.content);
          break;
        case "model-output.end": {
          const data = response.content;
          updateGeneratingMessage(response.conversationId, "assistant", {
            id: data.id,
            type: "assistant",
            content: data.content,
            isGenerating: false,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          });
          break;
        }
        case "error":
          removeGeneratingMessage(response.conversationId, "assistant");
          removeGeneratingMessage(response.conversationId, "think");
          addDisplayMessage(response.conversationId, {
            type: "error",
            errorMessage: response.content.errorMessage,
            errorCode: response.content.errorCode,
            createdAt: new Date(response.content.createdAt),
            updatedAt: new Date(response.content.updatedAt),
          });
          break;
        case "event.end":
          upsertConversationMemory(response.conversationId, {
            isReady: true,
            mostRecentlyModel: conversationMemory.mostRecentlyModel,
            messages: conversationMemory.messages,
          });
          break;
      }
    });
    return () => unsubscribe();
  }, [
    addDisplayMessage,
    updateGeneratingMessage,
    appendContentToGeneratingMessage,
    removeGeneratingMessage,
  ]);

  return {
    displayMessages,
    mostRecentlyModel,
    isLoading,
    createConversation,
    sendMessage,
  };
}

function toDisplayMessage(message: ConversationMessage): DisplayMessage | null {
  switch (message.type) {
    case "user":
      return {
        id: message.id,
        content: message.content,
        type: "user",
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      };
    case "assistant":
    case "think":
      return {
        id: message.id,
        content: message.content,
        type: message.type,
        isGenerating: false,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      };
    case "error":
      return {
        id: message.id,
        type: "error",
        errorMessage: message.errorMessage,
        errorCode: message.errorCode,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      };
    default:
      return null;
  }
}

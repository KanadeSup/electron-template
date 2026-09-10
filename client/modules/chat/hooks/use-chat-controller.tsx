import { toast } from "@client/modules/design-system/components/shadcn-ui/toast";
import type { ConversationMessage } from "@shared/contracts/message.contract";
import Logger from "electron-log";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createConversation as createConversationApi,
  getConversationById,
} from "../api/conversation.api";
import { onSendMessageEvent, sendMessage as sendMessageApi } from "../api/message.api";
import type { DisplayAssistantMessage, DisplayMessage } from "../types/message.type";

const SCOPE = "useChatController";

export type ChatControllerParams = {
  conversationId: number | null;
};

export type SendMessageOptions = {
  model: string;
};

type ConversationId = number;
type ConversationMemories = Record<ConversationId, ConversationMemory>;
type ConversationMemory = {
  /** Whether the conversation is ready to be used */
  isReady: boolean;
  messages: DisplayMessage[];
};

export function useChatController(params: ChatControllerParams) {
  const { conversationId } = params;

  const [conversationMemories, setConversationMemories] = useState<ConversationMemories>({});
  const cachedConversationIdsRef = useRef<number[]>([]);

  cachedConversationIdsRef.current = Object.keys(conversationMemories).map(Number);

  const displayMessages = useMemo(() => {
    if (!conversationId) return [];
    return conversationMemories[conversationId]?.messages || [];
  }, [conversationMemories, conversationId]);

  const createConversation = async () => {
    const response = await createConversationApi();
    if (!response.success) {
      Logger.error(SCOPE, response.errorMessage || "Error creating conversation");
      return null;
    }
    const conversationId = response.data.conversationId;

    // Create a new conversation memory to prevent
    // system from calling api to load the conversation
    setConversationMemories((prev) => ({
      ...prev,
      [conversationId]: {
        isReady: true,
        messages: [],
      },
    }));

    return conversationId;
  };

  const sendMessage = async (
    conversationId: number,
    message: string,
    options: SendMessageOptions,
  ) => {
    const conversationMemory = conversationMemories[conversationId];
    if (!conversationMemory) return;
    if (!conversationMemory.isReady) return;

    // Lock the conversation immediately and wait for
    // the streaming finish to unlock it
    conversationMemory.isReady = false;
    const response = await sendMessageApi({
      conversationId,
      message,
      model: options.model,
    });

    if (!response.success) {
      // Unlock the conversation immediately if failed
      setConversationMemories((prev) => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          isReady: true,
        },
      }));
      Logger.error(SCOPE, "Failed to send message", response.errorMessage);
      toast.add({
        type: "error",
        title: "Error sending message",
        description: "Please try again or check logs for more details.",
        priority: "high",
      });
      return;
    }
  };

  // Load conversation when the conversationId changes
  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) return;
      if (conversationMemories[conversationId]) return;
      const resp = await getConversationById({
        conversationId,
      });
      if (!resp.success) {
        Logger.error(SCOPE, "Error getting conversation", resp.errorMessage);
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
        isReady: true,
        messages: resp.data.messages
          .map((message) => toDisplayMessage(message))
          .filter((message) => message !== null),
      };
      setConversationMemories((prev) => ({
        // The memory should only keep the last 5 conversations to avoid memory leaks
        ...Object.fromEntries(Object.entries(prev).slice(-4)),
        [conversationId]: conversationMemory,
      }));
    }
    loadConversation();
  }, [conversationId, conversationMemories]);

  const addDisplayMessage = useCallback((conversationId: number, message: DisplayMessage) => {
    setConversationMemories((prev) => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        messages: [...prev[conversationId].messages, message],
      },
    }));
  }, []);

  const updateGeneratingMessage = useCallback(
    (conversationId: number, type: "assistant" | "think", message: DisplayAssistantMessage) => {
      setConversationMemories((prev) => {
        const newMessages = prev[conversationId].messages.map((m) => {
          if (m.type === type && m.isGenerating) {
            return { ...message };
          }
          return m;
        });
        return {
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            messages: newMessages,
          },
        };
      });
    },
    [],
  );

  const appendContentToGeneratingMessage = useCallback(
    (conversationId: number, type: "assistant" | "think", chunk: string) => {
      setConversationMemories((prev) => {
        const newMessages = prev[conversationId].messages.map((m) => {
          if (m.type === type && m.isGenerating) {
            return { ...m, content: m.content + chunk };
          }
          return m;
        });
        return {
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            messages: newMessages,
          },
        };
      });
    },
    [],
  );

  const removeGeneratingMessage = useCallback(
    (conversationId: number, type: "assistant" | "think") => {
      setConversationMemories((prev) => {
        const newMessages = prev[conversationId].messages.filter(
          (m) => m.type !== type || !m.isGenerating,
        );
        return {
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            messages: newMessages,
          },
        };
      });
    },
    [],
  );

  // stream message events
  useEffect(() => {
    const unsubscribe = onSendMessageEvent((response) => {
      const cachedConversationIds = cachedConversationIdsRef.current;
      if (!cachedConversationIds.includes(response.conversationId)) {
        Logger.error(SCOPE, "Conversation not cached", response.conversationId);
        return;
      }

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
          addDisplayMessage(response.conversationId, {
            type: "error",
            errorMessage: response.content.errorMessage,
            errorCode: response.content.errorCode,
            createdAt: new Date(response.content.createdAt),
            updatedAt: new Date(response.content.updatedAt),
          });
          break;
        case "event.end":
          setConversationMemories((prev) => ({
            ...prev,
            [response.conversationId]: {
              ...prev[response.conversationId],
              isReady: true,
            },
          }));
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

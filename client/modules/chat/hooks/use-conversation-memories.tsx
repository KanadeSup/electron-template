import { useCallback, useRef, useState } from "react";
import type { DisplayMessage } from "../types/message.type";

type ConversationId = number;
export type ConversationMemories = Record<ConversationId, ConversationMemory>;
export type ConversationMemory = {
  /** Whether the conversation is ready to be used */
  isReady: boolean;
  messages: DisplayMessage[];
};

export function useConversationMemories() {
  const [conversationMemories, setConversationMemories] = useState<ConversationMemories>({});
  const conversationMemoriesRef = useRef<ConversationMemories>({});

  const upsertConversationMemory = useCallback(
    (conversationId: number, memory: ConversationMemory) => {
      // Only include 5 latest conversations to avoid memory leaks
      const latestConversationIds = Object.fromEntries(
        Object.entries(conversationMemoriesRef.current).slice(-4),
      );

      const nextMemories: ConversationMemories = {
        ...latestConversationIds,
        [conversationId]: {
          isReady: memory.isReady,
          messages: memory.messages,
        },
      };

      conversationMemoriesRef.current = nextMemories;
      setConversationMemories(() => ({
        ...nextMemories,
      }));
    },
    [],
  );

  return {
    conversationMemories,
    /**
     * A ref to the conversation memories.
     * - This ref will be updated immediately after the conversation memory is set
     * without waiting for the next render to update the state.
     *
     * **Readonly** (Do not mutate this ref directly)
     */
    conversationMemoriesRef,
    upsertConversationMemory,
  };
}

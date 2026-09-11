import { useMemo } from "react";
import type {
  DisplayAssistantMessage,
  DisplayMessage,
  DisplayUserMessage,
} from "../../types/message.type";

type AssistantMessageWithThinking = DisplayAssistantMessage & {
  type: "assistant";
  isThinking: boolean;
  thinkingContent: string;
};

type ChatListItem = DisplayMessage | AssistantMessageWithThinking;

export type ChatMessageListProps = {
  messages: DisplayMessage[];
};

export function ChatMessageList(props: ChatMessageListProps) {
  const { messages } = props;
  const listItems = useMemo(() => combineAdjacentThinkAndAssistant(messages), [messages]);

  return (
    <div className="flex flex-col gap-2">
      {listItems.map((message, index) => (
        <ChatMessageItem key={getListItemKey(message, index)} message={message} />
      ))}
    </div>
  );
}

type ChatMessageItemProps = {
  message: ChatListItem;
};

function ChatMessageItem(props: ChatMessageItemProps) {
  const { message } = props;
  if (message.type === "user") {
    return <UserMessage message={message} />;
  }
  if (message.type === "assistant") {
    return <AssistantMessage message={message} />;
  }
  if (message.type === "error") {
    return <div>{message.errorMessage}</div>;
  }
  return null;
}

type UserMessageProps = {
  message: DisplayUserMessage;
};

function UserMessage(props: UserMessageProps) {
  const { message } = props;
  return (
    <div className="flex justify-end pl-10">
      <div className="bg-primary rounded-lg px-4 py-2">{message.content}</div>
    </div>
  );
}

type AssistantMessageProps = {
  message: DisplayAssistantMessage | AssistantMessageWithThinking;
};

function AssistantMessage(props: AssistantMessageProps) {
  const { message } = props;
  const thinkingContent = "thinkingContent" in message ? message.thinkingContent : undefined;

  return (
    <div className="flex justify-start pr-10">
      <div className="bg-secondary flex min-w-0 flex-col gap-2 rounded-lg px-4 py-2">
        {thinkingContent != null && thinkingContent !== "" && (
          <div className="text-muted-foreground whitespace-pre-wrap text-sm">{thinkingContent}</div>
        )}
        {thinkingContent != null && thinkingContent !== "" && message.content !== "" && (
          <div className="border-border border-t" />
        )}
        {message.content}
      </div>
    </div>
  );
}

function combineAdjacentThinkAndAssistant(messages: DisplayMessage[]): ChatListItem[] {
  const items: ChatListItem[] = [];

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    const next = messages[i + 1];

    if (next && current.type === "think" && next.type === "assistant") {
      items.push({
        ...next,
        type: "assistant",
        isThinking: current.isGenerating,
        thinkingContent: current.content,
      });
      i += 1;
      continue;
    }

    if (current.type === "think") {
      items.push({
        id: current.id,
        content: "",
        type: "assistant",
        isThinking: current.isGenerating,
        thinkingContent: current.content,
        isGenerating: false,
        createdAt: current.createdAt,
        updatedAt: current.updatedAt,
      });
      continue;
    }

    items.push(current);
  }

  return items;
}

function getListItemKey(item: ChatListItem, index: number): string {
  if (item.id != null) {
    return `${item.type}-${item.id}`;
  }
  return `${item.type}-pending-${index}`;
}

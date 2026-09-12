import { useState } from "react";

import type {
  DisplayAssistantMessage,
  DisplayMessage,
  DisplayUserMessage,
} from "../../types/message.type";
import "streamdown/styles.css";
import { code } from "@streamdown/code";
import { cn } from "cn";
import { ChevronDownIcon, Loader, SparklesIcon } from "lucide-react";
import { Streamdown } from "streamdown";
import "./chat-message.css";
import { ThreeDot } from "@client/modules/design-system/components/animation/three-dot";

export type ChatMessageListProps = {
  messages: DisplayMessage[];
};

export function ChatMessageList(props: ChatMessageListProps) {
  const { messages } = props;

  return (
    <div className="flex flex-col gap-2 px-10">
      {messages.map((message, index) => (
        <ChatMessageItem key={getListItemKey(message, index)} message={message} />
      ))}
    </div>
  );
}

type ChatMessageItemProps = {
  message: DisplayMessage;
};

function ChatMessageItem(props: ChatMessageItemProps) {
  const { message } = props;
  if (message.type === "user") {
    return <UserMessage message={message} />;
  }
  if (message.type === "think") {
    return <ThinkingMessage message={message} />;
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
    <div className="flex justify-end pl-[30%] mb-5">
      <div className="bg-primary rounded-lg px-4 py-2">{message.content}</div>
    </div>
  );
}

type ThinkingMessageProps = {
  message: DisplayAssistantMessage<"think">;
};

function ThinkingMessage(props: ThinkingMessageProps) {
  const { message } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const shouldShowThinking = message.isGenerating || message.content;
  if (!shouldShowThinking) return null;
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg px-4 py-2 select-none">
      <div
        className={cn(
          "group bg-secondary/60 rounded-lg px-2 py-2 max-w-50",
          "flex items-center justify-between gap-2 text-sm",
          "transition-all duration-300",
          "hover:border-foreground/25 border cursor-pointer",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn("flex items-center gap-2")}>
          {message.isGenerating ? (
            <Loader className="w-4 h-4 stroke-primary stroke-3 animate-spin" />
          ) : (
            <SparklesIcon className="w-4 h-4 stroke-blue-500/50 stroke-3" />
          )}
          {message.isGenerating ? (
            <p
              className={cn(
                "font-semibold",
                "bg-linear-to-r from-foreground/50 to-foreground/60 bg-size-[200%_auto]",
                "bg-clip-text text-transparent animate-color-wave",
              )}
            >
              Thinking ...
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground/80"> Thought </p>
            </div>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 stroke-foreground/50 group-hover:stroke-foreground/80",
            "transition-all duration-300",
            !isExpanded && "rotate-180",
          )}
        />
      </div>
      <div
        className={cn(
          "bg-secondary/60 rounded-lg px-2 py-2 w-175",
          "border border-border text-muted-foreground",
          "streamdown-sm select-text",
          !isExpanded && "hidden",
        )}
      >
        {!message.content ? (
          <div className="flex items-center gap-2">
            <ThreeDot className="py-2" />
          </div>
        ) : (
          <Streamdown plugins={{ code: code }}>{message.content}</Streamdown>
        )}
      </div>
    </div>
  );
}

type AssistantMessageProps = {
  message: DisplayAssistantMessage<"assistant">;
};

function AssistantMessage(props: AssistantMessageProps) {
  const { message } = props;

  return (
    <div className={cn("flex w-full flex-col gap-2 rounded-lg px-4 py-2", "mb-20")}>
      {!message.content && (
        <div
          className={cn(
            "group bg-secondary/40 rounded-lg px-2 py-2 max-w-44",
            "flex items-center gap-2 text-sm",
          )}
        >
          <Loader className="w-4 h-4 stroke-primary stroke-3 animate-spin" />
          <p className="font-bold text-foreground/80"> Generating ... </p>
        </div>
      )}
      {message.content && <Streamdown plugins={{ code: code }}>{message.content}</Streamdown>}
    </div>
  );
}

function getListItemKey(item: DisplayMessage, index: number): string {
  if (item.id != null) {
    return `${item.type}-${item.id}`;
  }
  return `${item.type}-pending-${index}`;
}

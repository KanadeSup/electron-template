import type {
  DisplayAssistantMessage,
  DisplayMessage,
  DisplayUserMessage,
} from "../../types/message.type";

type AssistantMessageWithThinking = DisplayAssistantMessage & {
  isThinking: true;
  thinkingContent: string;
};

export type ChatMessageListProps = {
  messages: DisplayMessage[];
};

export function ChatMessageList(props: ChatMessageListProps) {
  const { messages } = props;

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
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
    return <div>{message.content}</div>;
  }
  if (message.type === "assistant") {
    return <AssistantMessage message={message} />;
  }
  if (message.type === "think") {
    return <AssistantMessage message={message} />;
  }
  if (message.type === "error") {
    return <div>{message.errorMessage}</div>;
  }
  return <div>{message.content}</div>;
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
  message: DisplayAssistantMessage;
};

function AssistantMessage(props: AssistantMessageProps) {
  const { message } = props;
  return (
    <div className="flex justify-start pr-10">
      <div className="bg-secondary rounded-lg px-4 py-2">{message.content}</div>
    </div>
  );
}

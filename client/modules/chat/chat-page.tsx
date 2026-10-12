import { useNavigate, useParams } from "react-router";
import { AssistantSelect } from "../assistant/components/assistant-select/assistant-select";
import { ScrollArea } from "../design-system/components/shadcn-ui/scroll-area";
import { toast } from "../design-system/components/shadcn-ui/toast";
import { truncate } from "../design-system/lib/utils";
import { usePersistStateStore } from "../persist-state/stores/persist-state-store";
import { ChatInput, type ChatInputSubmitOptions } from "./components/chat-input/chat-input";
import { ChatLayout } from "./components/chat-layout/chat-layout";
import { ChatMessageList } from "./components/chat-message-list/chat-message-list";
import { useChatController } from "./hooks/use-chat-controller";

export function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId ? Number(params.conversationId) : null;

  const navigate = useNavigate();
  const persistStateActions = usePersistStateStore((state) => state.actions);

  const chatController = useChatController({
    conversationId,
  });

  const handleSubmit = async (message: string, options: ChatInputSubmitOptions) => {
    let activeConversationId = conversationId;
    if (activeConversationId === null) {
      activeConversationId = await chatController.createConversation(
        messageToConversationName(message),
        options.model,
      );
      if (!activeConversationId) {
        toast.add({
          type: "error",
          title: "Error creating conversation",
          description: "Please try again or check logs for more details.",
          priority: "high",
        });
        return;
      }
      navigate(`/chat/${activeConversationId}`);
    }
    chatController.sendMessage(activeConversationId, message, {
      model: options.model,
    });
  };

  const handleDeleted = (id: number) => {
    if (conversationId === id) {
      navigate("/chat");
    }
  };

  return (
    <ChatLayout className="flex flex-col gap-3 relative" onDeleted={handleDeleted}>
      <div className="w-full">
        <AssistantSelect />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center w-full h-full">
          <div className="max-w-325 w-full px-4 h-full">
            <ChatMessageList
              messages={chatController.displayMessages}
              loading={chatController.isLoading}
              className="h-full"
            />
          </div>
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 w-full flex justify-center">
        <div className="max-w-325 w-full px-4">
          <ChatInput
            placeholder="Ask me anything..."
            initialModel={{
              key: conversationId?.toString() ?? null,
              value: chatController.mostRecentlyModel,
            }}
            onSubmit={handleSubmit}
            onModelChange={(model) => persistStateActions.setSelectedModel(model)}
          />
        </div>
      </div>
    </ChatLayout>
  );
}

function messageToConversationName(message: string): string {
  // Replace all newlines with spaces
  message = message.replace(/\n/g, " ");

  // replace all tab with spaces
  message = message.replace(/\t/g, " ");

  // Replace all multiple spaces with a single space
  message = message.replace(/\s+/g, " ");

  // Replace all leading and trailing spaces with a single space
  message = message.trim();

  return truncate(message, 100);
}

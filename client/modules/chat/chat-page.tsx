import { useNavigate, useParams } from "react-router";
import { AssistantSelect } from "../assistant/components/assistant-select/assistant-select";
import { AppLayout } from "../design-system/components/app-layout/app-layout";
import { ScrollArea } from "../design-system/components/shadcn-ui/scroll-area";
import { toast } from "../design-system/components/shadcn-ui/toast";
import { ChatInput } from "./components/chat-input/chat-input";
import { ChatMessageList } from "./components/chat-message-list/chat-message-list";
import { useChatController } from "./hooks/use-chat-controller";

export function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId ? Number(params.conversationId) : null;

  const navigate = useNavigate();

  const chatController = useChatController({
    conversationId,
  });

  const handleSubmit = async (message: string) => {
    let activeConversationId = conversationId;
    if (activeConversationId === null) {
      activeConversationId = await chatController.createConversation();
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
      model: "gemini-2.5-flash",
    });
  };
  return (
    <AppLayout className="flex flex-col gap-3">
      <div className="w-full">
        <AssistantSelect />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center w-full">
          <div className="max-w-250 w-full relative px-4">
            <ChatMessageList
              messages={chatController.displayMessages}
              loading={chatController.isLoading}
            />
            <div className="sticky bottom-0 w-full">
              <ChatInput placeholder="Ask me anything..." onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </AppLayout>
  );
}

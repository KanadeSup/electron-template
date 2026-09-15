import { useNavigate, useParams } from "react-router";
import { AssistantSelect } from "../assistant/components/assistant-select/assistant-select";
import { AppLayout } from "../design-system/components/app-layout/app-layout";
import { ScrollArea } from "../design-system/components/shadcn-ui/scroll-area";
import { toast } from "../design-system/components/shadcn-ui/toast";
import { ChatInput, type ChatInputSubmitOptions } from "./components/chat-input/chat-input";
import { ChatMessageList } from "./components/chat-message-list/chat-message-list";
import { ConversationList } from "./components/conversation-list/conversation-list";
import { useChatController } from "./hooks/use-chat-controller";
import { useDeleteConversation } from "./hooks/use-delete-conversation";

export function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId ? Number(params.conversationId) : null;

  const navigate = useNavigate();
  const deleteConversationMutation = useDeleteConversation();

  const chatController = useChatController({
    conversationId,
  });

  const handleSubmit = async (message: string, options: ChatInputSubmitOptions) => {
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
      model: options.model,
    });
  };

  const handleSelect = (id: number) => {
    navigate(`/chat/${id}`);
  };

  const handleDelete = (id: number) => {
    deleteConversationMutation.mutate(
      { conversationId: id },
      {
        onSuccess: () => {
          if (conversationId === id) {
            navigate("/chat");
          }
        },
        onError: () => {
          toast.add({
            type: "error",
            title: "Error deleting conversation",
            description: "Please try again or check logs for more details.",
          });
        },
      },
    );
  };

  return (
    <AppLayout
      className="flex flex-col gap-3 relative"
      list={
        <ConversationList
          selectedId={conversationId}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      }
    >
      <div className="w-full">
        <AssistantSelect />
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center w-full h-full">
          <div className="max-w-250 w-full px-4 h-full">
            <ChatMessageList
              messages={chatController.displayMessages}
              loading={chatController.isLoading}
              className="h-full"
            />
          </div>
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 w-full flex justify-center">
        <div className="max-w-250 w-full px-4">
          <ChatInput placeholder="Ask me anything..." onSubmit={handleSubmit} />
        </div>
      </div>
    </AppLayout>
  );
}

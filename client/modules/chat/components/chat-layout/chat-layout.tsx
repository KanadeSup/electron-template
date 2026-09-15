import { useNavigate, useParams } from "react-router";
import {
  AppLayout,
  type AppLayoutProps,
} from "../../../design-system/components/app-layout/app-layout";
import { toast } from "../../../design-system/components/shadcn-ui/toast";
import { useDeleteConversation } from "../../hooks/use-delete-conversation";
import { ConversationList } from "../conversation-list/conversation-list";

export interface ChatLayoutProps extends Omit<AppLayoutProps, "list"> {
  onDeleted?: (id: number) => void;
}

export function ChatLayout({ children, className, onDeleted }: ChatLayoutProps) {
  const params = useParams();
  const selectedId = params.conversationId ? Number(params.conversationId) : null;
  const navigate = useNavigate();
  const deleteConversationMutation = useDeleteConversation();

  const handleSelect = (id: number) => {
    navigate(`/chat/${id}`);
  };

  const handleDelete = (id: number) => {
    deleteConversationMutation.mutate(
      { conversationId: id },
      {
        onSuccess: () => {
          onDeleted?.(id);
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
      className={className}
      list={
        <ConversationList selectedId={selectedId} onSelect={handleSelect} onDelete={handleDelete} />
      }
    >
      {children}
    </AppLayout>
  );
}

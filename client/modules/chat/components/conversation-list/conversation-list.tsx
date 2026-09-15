import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { cn } from "cn";
import { Trash } from "lucide-react";
import { useGetConversationList } from "../../hooks/use-get-conversation-list";

export type ConversationListProps = {
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectedId?: number | null;
};
export function ConversationList(props: ConversationListProps) {
  const { selectedId, onDelete, onSelect } = props;
  const { data: conversations } = useGetConversationList();
  if (!conversations) return null;
  return (
    <div className="flex flex-col gap-1 pr-3">
      {conversations?.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "group/item px-2 py-1 rounded-md",
            "hover:bg-muted cursor-pointer",
            "transition-all text-sm font-medium",
            "flex items-center justify-between",
            selectedId === conversation.id ? "bg-muted" : "",
          )}
          onClick={() => onSelect?.(conversation.id)}
        >
          <p className="truncate">{conversation.name}</p>
          <Button
            variant="ghost"
            size="icon-xs"
            className="group/btn opacity-0 group-hover/item:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(conversation.id);
            }}
          >
            <Trash className="w-5 h-5 stroke-destructive/60 stroke-3 group-hover/btn:stroke-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

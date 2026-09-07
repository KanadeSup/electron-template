import { type LucideIcon, MessageCirclePlus, Search, Settings } from "lucide-react";
import { Button } from "../shadcn-ui/button";

export function ActionList() {
  return (
    <div className="flex flex-col gap-1">
      <ActionItem icon={MessageCirclePlus} label="New chat" />
      <ActionItem icon={Search} label="Search" />
      <ActionItem icon={Settings} label="Settings" />
    </div>
  );
}

type ActionItemProps = {
  icon: LucideIcon;
  label: string;
};
function ActionItem(props: ActionItemProps) {
  const { icon: Icon, label } = props;
  return (
    <Button variant="ghost" className="w-full flex items-center justify-start px-1.5 gap-2">
      <Icon className="w-4 h-4 stroke-foreground/70 stroke-[3px]" />
      <span className="font-medium">{label}</span>
    </Button>
  );
}

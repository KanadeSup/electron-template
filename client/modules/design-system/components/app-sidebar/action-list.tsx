import { cn } from "cn";
import { type LucideIcon, MessageCirclePlus, Search, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../shadcn-ui/button";

export function ActionList() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-1">
      <ActionItem
        icon={MessageCirclePlus}
        label="New chat"
        isActive={pathname === "/chat"}
        onClick={() => navigate("/")}
      />
      <ActionItem icon={Search} label="Search" />
      <ActionItem
        icon={Settings}
        label="Settings"
        isActive={pathname === "/settings"}
        onClick={() => navigate("/settings")}
      />
    </div>
  );
}

type ActionItemProps = {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};
function ActionItem(props: ActionItemProps) {
  const { icon: Icon, label, isActive, onClick } = props;
  return (
    <Button
      variant="ghost"
      className={cn("w-full flex items-center justify-start px-1.5 gap-2", isActive && "bg-muted")}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 stroke-foreground/70 stroke-[3px]" />
      <span className="font-medium">{label}</span>
    </Button>
  );
}

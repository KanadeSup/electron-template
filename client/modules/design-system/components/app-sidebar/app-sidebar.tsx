import { cn } from "cn";
import { Sidebar } from "lucide-react";
import { Button } from "../shadcn-ui/button";
import { ScrollArea } from "../shadcn-ui/scroll-area";
import { ActionList } from "./action-list";

export type AppSidebarProps = {
  className?: string;
  list?: React.ReactNode;
};

export function AppSidebar(props: AppSidebarProps) {
  const { className, list } = props;

  return (
    <div
      className={cn(
        "h-full w-full bg-sidebar rounded-xl max-w-96",
        "border border-border px-1 py-2",
        "flex flex-col gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-between px-1.5">
        <h1 className="font-semibold text-sm"> Mindful </h1>
        <Button variant="ghost" size="icon-sm">
          <Sidebar className="w-4 h-4 stroke-foreground/70 stroke-3" />
        </Button>
      </div>

      <div>
        <ActionList />
      </div>
      <ScrollArea className="flex-1">
        <div className="h-full">{list}</div>
      </ScrollArea>
    </div>
  );
}

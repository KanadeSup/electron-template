import { useSubscribeCommand } from "@client/modules/command/stores/command-store";
import { usePersistStateStore } from "@client/modules/persist-state/stores/persist-state-store";
import { cn } from "cn";
import { useCallback, useState } from "react";
import { AppSidebar } from "../app-sidebar/app-sidebar";
import { HorizontalResizablePanel } from "../resizable/horizontal-resizable-panel";

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  list?: React.ReactNode;
}

export function AppLayout({ children, className, list }: AppLayoutProps) {
  const defaultIsSidebarOpen = usePersistStateStore((state) => state.isSidebarOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(defaultIsSidebarOpen ?? true);
  const persistStateActions = usePersistStateStore((state) => state.actions);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => {
      persistStateActions.setIsSidebarOpen(!prev);
      return !prev;
    });
  }, [persistStateActions]);

  useSubscribeCommand("app-sidebar.toggle", handleToggleSidebar);

  return (
    <div className="w-screen h-screen flex p-2 gap-4">
      <div className={cn("shrink-0", isSidebarOpen ? "block" : "hidden")}>
        <HorizontalResizablePanel
          defaultSize={250}
          minSize={200}
          maxSize={500}
          className="h-full"
          handleGap={5}
        >
          <AppSidebar list={list} className="max-w-full" />
        </HorizontalResizablePanel>
      </div>
      <div className={cn("flex-1 shrink-0 overflow-hidden", className)}>{children}</div>
    </div>
  );
}

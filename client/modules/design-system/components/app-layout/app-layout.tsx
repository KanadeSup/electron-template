import { useSubscribeCommand } from "@client/modules/command/stores/command-store";
import { cn } from "cn";
import { useCallback, useState } from "react";
import { AppSidebar } from "../app-sidebar/app-sidebar";

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  list?: React.ReactNode;
}

export function AppLayout({ children, className, list }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useSubscribeCommand("app-sidebar.toggle", handleToggleSidebar);

  return (
    <div className="w-screen h-screen flex p-2 gap-4">
      <div className={cn("w-64 shrink-0", isSidebarOpen ? "block" : "hidden")}>
        <AppSidebar list={list} />
      </div>
      <div className={cn("flex-1 shrink-0 overflow-hidden", className)}>{children}</div>
    </div>
  );
}

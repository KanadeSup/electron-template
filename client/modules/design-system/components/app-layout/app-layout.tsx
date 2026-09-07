import { cn } from "cn";
import { AppSidebar } from "../app-sidebar/app-sidebar";

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="w-screen h-screen flex p-2 gap-4">
      <div className="w-64 shrink-0">
        <AppSidebar />
      </div>
      <div className={cn("flex-1 shrink-0 overflow-hidden", className)}>{children}</div>
    </div>
  );
}

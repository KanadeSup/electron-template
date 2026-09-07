import { AppSidebar } from "../app-sidebar";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="w-screen h-screen flex p-2 gap-3">
      <div className="w-64 shrink-0">
        <AppSidebar />
      </div>
      <div className="flex-1 shrink-0 overflow-hidden">{children}</div>
    </div>
  );
}

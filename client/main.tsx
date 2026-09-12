import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ChatPage } from "./modules/chat/chat-page";
import { Toaster } from "./modules/design-system/components/shadcn-ui/toast";
import { TooltipProvider } from "./modules/design-system/components/shadcn-ui/tooltip";
import { KeyboardProvider } from "./modules/keyboard/providers/keyboard-provider";
import { SettingPage } from "./modules/setting/setting-page";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const queryClient = new QueryClient();

createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <Toaster />
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat/:conversationId?" element={<ChatPage />} />
            <Route path="/settings" element={<SettingPage />} />
          </Routes>
        </TooltipProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);

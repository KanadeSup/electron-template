import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ChatPage } from "./modules/chat/chat-page";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const queryClient = new QueryClient();

createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>,
);

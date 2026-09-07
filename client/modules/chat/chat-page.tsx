import { AppLayout } from "../design-system/components/app-layout";
import { ChatInput } from "./components/chat-input";

export function ChatPage() {
  return (
    <AppLayout>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[70%]">
          <ChatInput placeholder="Ask me anything..." />
        </div>
      </div>
    </AppLayout>
  );
}

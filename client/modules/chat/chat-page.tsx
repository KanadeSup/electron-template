import { AssistantSelect } from "../assistant/components/assistant-select/assistant-select";
import { AppLayout } from "../design-system/components/app-layout/app-layout";
import { ChatInput } from "./components/chat-input/chat-input";

export function ChatPage() {
  return (
    <AppLayout className="flex flex-col gap-3">
      <div className="w-full">
        <AssistantSelect />
      </div>
      <div className="w-full flex-1 flex flex-col justify-center items-center">
        <div className="w-[70%]">
          <ChatInput placeholder="Ask me anything..." />
        </div>
      </div>
    </AppLayout>
  );
}

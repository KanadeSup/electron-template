import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { Textarea } from "@client/modules/design-system/components/shadcn-ui/textarea";
import { cn } from "cn";
import { SendIcon } from "lucide-react";
import { useState } from "react";

export type ChatInputProps = {
  className?: string;
  placeholder?: string;
};
export function ChatInput(props: ChatInputProps) {
  const { className, placeholder } = props;

  const [value, setValue] = useState("");

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border",
        "flex flex-col bg-sidebar border-2 focus-within:border-ring border-input",
        className,
      )}
    >
      <Textarea
        spellCheck={false}
        className={cn(
          "resize-none p-3 max-h-48 font-medium text-base!",
          "focus-within:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:border-transparent border-transparent bg-transparent!",
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center justify-between gap-2 p-3">
        <div></div>
        <Button variant="default" size="icon" className="rounded-2xl" disabled={!value}>
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}

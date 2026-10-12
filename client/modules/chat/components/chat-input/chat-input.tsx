import { ModelSelect } from "@client/modules/ai-model/components/model-select/model-select";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { Textarea } from "@client/modules/design-system/components/shadcn-ui/textarea";
import { usePersistStateStore } from "@client/modules/persist-state/stores/persist-state-store";
import { cn } from "cn";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type ChatInputSubmitOptions = {
  model: string;
};

export type ChatInputInitialModel = {
  key: string | null;
  value: string | null;
};

export type ChatInputProps = {
  className?: string;
  placeholder?: string;
  initialModel?: ChatInputInitialModel | null;
  loading?: boolean;
  onSubmit?: (message: string, options: ChatInputSubmitOptions) => void;
  onModelChange?: (model: string) => void;
};
export function ChatInput(props: ChatInputProps) {
  const { className, placeholder, initialModel, loading, onSubmit, onModelChange } = props;

  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [value, setValue] = useState("");

  const defaultModel = usePersistStateStore((state) => state.selectedModel);
  const [selectedModel, setSelectedModel] = useState<string | null>(defaultModel ?? null);

  const handleSubmit = () => {
    if (loading) return;
    if (!selectedModel) return;
    onSubmit?.(value, { model: selectedModel });
    setValue("");
  };

  useEffect(() => {
    if (initialModel?.value) {
      setSelectedModel(initialModel.value);
    }
    // This is to prevent the eslint warning about the unused variable
    // If any key or value changes, the useEffect will be triggered
    void initialModel?.key;
  }, [initialModel?.key, initialModel?.value]);

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border",
        "flex flex-col bg-sidebar border-2 border-input",
        isTextareaFocused && "border-ring",
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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={() => setIsTextareaFocused(false)}
      />
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div>
          <ModelSelect
            selectedModel={selectedModel}
            onSelect={(model) => {
              setSelectedModel(model);
              onModelChange?.(model);
            }}
          />
        </div>
        <Button
          variant="default"
          size="icon"
          className="rounded-2xl"
          disabled={!value || loading}
          onClick={handleSubmit}
        >
          {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SendIcon />}
        </Button>
      </div>
    </div>
  );
}

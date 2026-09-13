import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { cn } from "cn";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { KeyboardInput } from "./keyboard-input";

export type KeyboardFieldProps = {
  title: string;
  description?: string;
  sequenceKey: string | null;
  defaultSequenceKey?: string | null;
  onChange?: (sequenceKey: string) => void;
  onRemove?: () => void;
};
export function KeyboardField(props: KeyboardFieldProps) {
  const { title, description, sequenceKey, defaultSequenceKey, onChange, onRemove } = props;

  return (
    <div className={cn("flex items-center gap-4", "transition-colors")}>
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <p className="font-semibold leading-none text-sm">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <KeyboardInput value={sequenceKey ?? ""} onChange={(key) => onChange?.(key)} />

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={sequenceKey === defaultSequenceKey || !defaultSequenceKey}
            onClick={() => defaultSequenceKey && onChange?.(defaultSequenceKey)}
            className={cn("text-muted-foreground hover:text-foreground", "disabled:opacity-30")}
          >
            <RotateCcwIcon className="size-3.5 stroke-muted-foreground stroke-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={!sequenceKey}
            onClick={() => onRemove?.()}
            className={cn(
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              "disabled:opacity-30",
            )}
          >
            <XIcon className="size-3.5 stroke-destructive stroke-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

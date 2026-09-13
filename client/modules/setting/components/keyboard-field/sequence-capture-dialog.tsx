import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@client/modules/design-system/components/shadcn-ui/dialog";
import {
  getKeysFromEvent,
  normalizeSequence,
  stringifyShortcutKeys,
} from "@client/modules/keyboard/lib/keyboard";
import { cn } from "cn";
import { useCallback, useEffect, useState } from "react";
import { KeyboardKdb } from "./keyboard-kdb";

export type SequenceCaptureDialogProps = {
  open: boolean;
  onConfirm: (keys: string) => void;
  onCancel: () => void;
};

export function SequenceCaptureDialog(props: SequenceCaptureDialogProps) {
  const { open, onConfirm, onCancel } = props;

  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setKeys([]);
    }
  }, [open]);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Enter" && keys.length > 0) {
        const sequence = keys.join("");
        const normalizedSequence = normalizeSequence(sequence);
        onConfirm(normalizedSequence);
        return;
      }

      if (event.key === "Backspace") {
        setKeys((prev) => prev.slice(0, -1));
        return;
      }

      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (keys.length >= 4) return;

      const pressedKeys = getKeysFromEvent(event);
      const pressedKeysString = stringifyShortcutKeys(pressedKeys);

      if (!pressedKeysString) return;

      setKeys((prev) => [...prev, pressedKeysString]);
    },
    [keys, onConfirm, onCancel],
  );

  useEffect(() => {
    if (!open) return;

    window.addEventListener("keydown", handleKeydown, true);
    return () => {
      window.removeEventListener("keydown", handleKeydown, true);
    };
  }, [open, handleKeydown]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-sm gap-0 overflow-hidden p-0 border-2 border-border"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Record shortcut</DialogTitle>
          <DialogDescription>
            Press a key combination, then Enter to confirm or Escape to cancel.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "flex min-h-36 flex-col items-center justify-center gap-3 bg-muted/30 px-6 py-8",
          )}
        >
          {keys.length > 0 ? (
            <KeyboardKdb sequenceKeys={keys} />
          ) : (
            <p className="text-sm text-muted-foreground font-semibold">Press your keyboard…</p>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
          Press Enter to confirm · Escape to cancel
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@client/modules/design-system/components/shadcn-ui/dialog";
import {
  getKeysFromEvent,
  isValidSequenceKeys,
  stringifyShortcutKeys,
} from "@client/modules/keyboard/lib/keyboard";
import { cn } from "cn";
import { useCallback, useEffect, useState } from "react";
import { KeyboardKdb } from "./keyboard-kdb";

export type SequenceKeyCaptureDialogProps = {
  open: boolean;
  onConfirm: (keys: string) => void;
  onCancel: () => void;
};

export function SequenceKeyCaptureDialog(props: SequenceKeyCaptureDialogProps) {
  const { open, onConfirm, onCancel } = props;

  const [sequenceKeys, setSequenceKeys] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSequenceKeys([]);
    }
  }, [open]);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Enter" && sequenceKeys.length > 0) {
        if (isValidSequenceKeys(sequenceKeys.join("+"))) {
          onConfirm(sequenceKeys.join("+"));
        }
        return;
      }

      if (event.key === "Backspace") {
        setSequenceKeys((prev) => prev.slice(0, -1));
        return;
      }

      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (sequenceKeys.length >= 4) return;

      const pressedKeys = getKeysFromEvent(event);
      const pressedKeysString = stringifyShortcutKeys(pressedKeys);

      if (!pressedKeysString) return;

      setSequenceKeys((prev) => [...prev, pressedKeysString]);
    },
    [sequenceKeys, onConfirm, onCancel],
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
          {sequenceKeys.length > 0 ? (
            <KeyboardKdb sequenceKeys={sequenceKeys} />
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

import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { sequenceToKeys } from "@client/modules/keyboard/lib/keyboard";
import { cn } from "cn";
import { useState } from "react";
import { KeyboardKdb } from "./keyboard-kdb";
import { SequenceCaptureDialog } from "./sequence-capture-dialog";

export type KeyboardInputProps = {
  value: string;
  className?: string;
  onChange: (key: string) => void;
};

export function KeyboardInput({ value, className, onChange }: KeyboardInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          "min-w-28 justify-center px-2.5 font-normal",
          !value && "text-muted-foreground hover:bg-muted/40 hover:border-ring",
          value && "bg-transparent! border-none hover:bg-muted/40!",
          className,
        )}
      >
        {value ? <KeyboardKdb sequenceKeys={sequenceToKeys(value)} /> : <p> Unset </p>}
      </Button>

      <SequenceCaptureDialog
        open={isOpen}
        onConfirm={(key) => {
          setIsOpen(false);
          onChange(key);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}

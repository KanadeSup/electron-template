import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { cn } from "cn";
import { useState } from "react";
import { SequenceKeyCaptureDialog } from "./sequence-key-capture-dialog";

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
        className={cn("min-w-28 justify-center px-2.5 font-normal", "hover:bg-muted/70", className)}
      >
        <kbd className="text-sm font-medium">{value}</kbd>
      </Button>

      <SequenceKeyCaptureDialog
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

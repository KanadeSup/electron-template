import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@client/modules/design-system/components/shadcn-ui/dialog";
import { Input } from "@client/modules/design-system/components/shadcn-ui/input";
import { useEffect, useState } from "react";

export type EditModelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelName: string;
  isSaving: boolean;
  onSave: (modelName: string) => Promise<void>;
};

export function EditModelDialog(props: EditModelDialogProps) {
  const { open, onOpenChange, modelName, isSaving, onSave } = props;
  const [modelNameValue, setModelNameValue] = useState(modelName);
  const trimmedModelName = modelNameValue.trim();
  const canSave = trimmedModelName.length > 0 && trimmedModelName !== modelName;

  useEffect(() => {
    if (open) setModelNameValue(modelName);
  }, [open, modelName]);

  async function handleSave() {
    if (!canSave) return;
    await onSave(trimmedModelName);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit model</DialogTitle>
          <DialogDescription>Update the model name used for this provider.</DialogDescription>
        </DialogHeader>
        <Input
          value={modelNameValue}
          placeholder="Model name"
          onChange={(event) => setModelNameValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSave();
            }
          }}
        />
        <DialogFooter className="bg-card border-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isSaving || !canSave} onClick={() => void handleSave()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

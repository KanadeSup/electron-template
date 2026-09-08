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
  modelId: string;
  isSaving: boolean;
  onSave: (modelId: string) => Promise<void>;
};

export function EditModelDialog(props: EditModelDialogProps) {
  const { open, onOpenChange, modelId, isSaving, onSave } = props;
  const [modelIdValue, setModelIdValue] = useState(modelId);
  const trimmedModelId = modelIdValue.trim();
  const canSave = trimmedModelId.length > 0 && trimmedModelId !== modelId;

  useEffect(() => {
    if (open) setModelIdValue(modelId);
  }, [open, modelId]);

  async function handleSave() {
    if (!canSave) return;
    await onSave(trimmedModelId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit model</DialogTitle>
          <DialogDescription>Update the model id used for this provider.</DialogDescription>
        </DialogHeader>
        <Input
          value={modelIdValue}
          placeholder="Model id"
          onChange={(event) => setModelIdValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSave();
            }
          }}
        />
        <DialogFooter>
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

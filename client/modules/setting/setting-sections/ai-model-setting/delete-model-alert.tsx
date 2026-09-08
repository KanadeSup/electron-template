import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@client/modules/design-system/components/shadcn-ui/alert-dialog";

export type DeleteModelAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  isDeleting: boolean;
  onConfirm: () => Promise<void>;
};

export function DeleteModelAlert(props: DeleteModelAlertProps) {
  const { open, onOpenChange, modelId, isDeleting, onConfirm } = props;

  async function handleConfirm() {
    await onConfirm();
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete model</AlertDialogTitle>
          <AlertDialogDescription>This will permanently delete {modelId}.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void handleConfirm()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

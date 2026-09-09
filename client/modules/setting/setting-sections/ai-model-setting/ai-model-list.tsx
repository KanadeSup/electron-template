import { useChangeAIModelPosition } from "@client/modules/ai-model/hooks/use-change-ai-model-position";
import { useDeleteAIModel } from "@client/modules/ai-model/hooks/use-delete-ai-model";
import { useFetchModelsByProvider } from "@client/modules/ai-model/hooks/use-fetch-models-by-provider";
import { useUpdateAIModel } from "@client/modules/ai-model/hooks/use-update-ai-model";
import type { AIModel, AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { Switch } from "@client/modules/design-system/components/shadcn-ui/switch";
import type { ChangeAIModelPositionRequest } from "@shared/contracts/ai-model.contract";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  RefreshCcwIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { DeleteModelAlert } from "./delete-model-alert";
import { EditModelDialog } from "./edit-model-dialog";

type AiModelListProps = {
  provider: AIProviderWithModels;
  isRefreshDisabled?: boolean;
  onBeforeRefresh?: () => Promise<void>;
};

export function AiModelList(props: AiModelListProps) {
  const { provider, isRefreshDisabled, onBeforeRefresh } = props;
  const models = [...provider.models].sort((a, b) => a.sortOrder - b.sortOrder);
  const fetchModels = useFetchModelsByProvider();
  const updateModel = useUpdateAIModel();
  const changePosition = useChangeAIModelPosition();
  const deleteModel = useDeleteAIModel();

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-input bg-sidebar p-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Models</p>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={fetchModels.isPending || isRefreshDisabled}
          onClick={async () => {
            await onBeforeRefresh?.();
            await fetchModels.mutateAsync(provider.id);
          }}
        >
          <RefreshCcwIcon className={fetchModels.isPending ? "animate-spin" : undefined} />
        </Button>
      </div>
      {fetchModels.isError && (
        <p className="text-sm text-destructive">{fetchModels.error.message}</p>
      )}
      {models.length === 0 && <p className="text-sm text-muted-foreground">No models added yet.</p>}
      <div className="flex flex-col gap-1">
        {models.map((model, index) => (
          <ModelRow
            key={model.id}
            model={model}
            isFirst={index === 0}
            isLast={index === models.length - 1}
            isMoving={changePosition.isPending && changePosition.variables?.id === model.id}
            isUpdating={updateModel.isPending && updateModel.variables?.id === model.id}
            isDeleting={deleteModel.isPending && deleteModel.variables?.id === model.id}
            onMove={(direction) => changePosition.mutate({ id: model.id, direction })}
            onToggleEnabled={(enabled) => updateModel.mutate({ id: model.id, enabled })}
            onUpdateModelName={async (modelName) => {
              await updateModel.mutateAsync({ id: model.id, modelName });
            }}
            onDelete={async () => {
              await deleteModel.mutateAsync({ id: model.id });
            }}
          />
        ))}
      </div>
    </section>
  );
}

type ModelRowProps = {
  model: AIModel;
  isFirst: boolean;
  isLast: boolean;
  isMoving: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onMove: (direction: ChangeAIModelPositionRequest["direction"]) => void;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateModelName: (modelName: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

function ModelRow(props: ModelRowProps) {
  const {
    model,
    isFirst,
    isLast,
    isMoving,
    isUpdating,
    isDeleting,
    onMove,
    onToggleEnabled,
    onUpdateModelName,
    onDelete,
  } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-muted">
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{model.modelName}</p>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isFirst || isMoving}
          onClick={() => onMove("up")}
        >
          <ChevronUpIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isLast || isMoving}
          onClick={() => onMove("down")}
        >
          <ChevronDownIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isUpdating}
          onClick={() => setIsEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-destructive"
          disabled={isDeleting}
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Switch
        size="sm"
        checked={model.enabled}
        disabled={isUpdating}
        onCheckedChange={onToggleEnabled}
      />

      <EditModelDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        modelName={model.modelName}
        isSaving={isUpdating}
        onSave={onUpdateModelName}
      />
      <DeleteModelAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        modelName={model.modelName}
        isDeleting={isDeleting}
        onConfirm={onDelete}
      />
    </div>
  );
}

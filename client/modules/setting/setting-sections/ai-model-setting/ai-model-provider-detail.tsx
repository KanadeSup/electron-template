import { useChangeAIModelPosition } from "@client/modules/ai-model/hooks/use-change-ai-model-position";
import { useCheckAPIKey } from "@client/modules/ai-model/hooks/use-check-api-key";
import { useDeleteAIModel } from "@client/modules/ai-model/hooks/use-delete-ai-model";
import { useFetchModelsByProvider } from "@client/modules/ai-model/hooks/use-fetch-models-by-provider";
import { useUpdateAIModel } from "@client/modules/ai-model/hooks/use-update-ai-model";
import { useUpdateAIProvider } from "@client/modules/ai-model/hooks/use-update-ai-provider";
import type { AIModel, AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { getProviderIcon } from "@client/modules/ai-model/utils/ai-model.util";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { PasswordInput } from "@client/modules/design-system/components/shadcn-ui/password-input";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { Switch } from "@client/modules/design-system/components/shadcn-ui/switch";
import type { ChangePositionDirection } from "@shared/contracts/ai-model.contract";
import type { CheckAPIKeyResponse } from "@shared/contracts/ai-provider.contract";
import {
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  PencilIcon,
  RefreshCcwIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { DeleteModelAlert } from "./delete-model-alert";
import { EditModelDialog } from "./edit-model-dialog";

export type AiModelProviderDetailProps = {
  provider: AIProviderWithModels;
  onBack: () => void;
};

export function AiModelProviderDetail(props: AiModelProviderDetailProps) {
  const { provider, onBack } = props;
  const ProviderIcon = getProviderIcon(provider.providerId) ?? BotIcon;
  const models = [...provider.models].sort((a, b) => a.sortOrder - b.sortOrder);
  const [apiKey, setApiKey] = useState(provider.apiKey);
  const [isApiKeyDirty, setIsApiKeyDirty] = useState(false);
  const [apiKeyValidation, setApiKeyValidation] = useState<CheckAPIKeyResponse | null>(null);
  const updateProvider = useUpdateAIProvider();
  const checkAPIKey = useCheckAPIKey();
  const fetchModels = useFetchModelsByProvider();
  const updateModel = useUpdateAIModel();
  const changePosition = useChangeAIModelPosition();
  const deleteModel = useDeleteAIModel();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-1 pr-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack}>
          <ChevronLeftIcon />
        </Button>
        <ProviderIcon className="w-4 h-4" />
        <p className="font-semibold">{provider.providerName}</p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 pr-4">
          <section className="flex flex-col gap-2 rounded-xl border border-input bg-sidebar p-3">
            <p className="text-base font-semibold">API key</p>
            <p className="text-sm text-muted-foreground">
              {getProviderApiKeyDescription(provider.providerName)}
            </p>

            {/* API key input */}
            <PasswordInput
              value={apiKey}
              placeholder="Enter API key"
              disabled={updateProvider.isPending}
              onChange={(event) => {
                setApiKey(event.target.value);
                setIsApiKeyDirty(true);
              }}
              onBlur={() => {
                if (!isApiKeyDirty) return;

                updateProvider.mutate(
                  { id: provider.id, apiKey },
                  { onSuccess: () => setIsApiKeyDirty(false) },
                );
              }}
            />

            <div>
              {/* Validate button */}
              <Button
                variant="secondary"
                size="sm"
                disabled={apiKey.trim().length === 0 || checkAPIKey.isPending}
                onClick={async () => {
                  const result = await checkAPIKey.mutateAsync({
                    providerId: provider.providerId,
                    apiKey: apiKey.trim(),
                  });
                  setApiKeyValidation(result);
                }}
              >
                <RefreshCcwIcon className={checkAPIKey.isPending ? "animate-spin" : undefined} />
                Validate API key
              </Button>

              {/* Validate result */}
              {apiKeyValidation && (
                <div className="flex flex-col gap-1 mt-2 p-2 bg-black/50 rounded-xl w-full">
                  {/* Validate result header */}
                  <div className="flex items-center justify-between">
                    {apiKeyValidation.valid ? (
                      <p className="flex items-center gap-1 text-sm text-green-600 font-bold">
                        <CheckIcon className="w-4 h-4 stroke-3" />
                        API key is valid.
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 text-sm text-destructive font-bold">
                        <XIcon className="stroke-3 w-4 h-4" />
                        API key is invalid.
                      </p>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setApiKeyValidation(null)}>
                      <XIcon className="stroke-3" />
                    </Button>
                  </div>

                  {/* Validate error message */}
                  {apiKeyValidation.valid === false && (
                    <div className="p-3 rounded-lg bg-card border border-destructive">
                      <p className={"flex items-center gap-1 text-sm text-destructive break-all"}>
                        {apiKeyValidation.message ?? "API key is invalid."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2 rounded-xl border border-input bg-sidebar p-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Models</p>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={fetchModels.isPending || updateProvider.isPending}
                onClick={async () => {
                  if (isApiKeyDirty) {
                    await updateProvider.mutateAsync({ id: provider.id, apiKey });
                    setIsApiKeyDirty(false);
                  }
                  await fetchModels.mutateAsync(provider.providerId);
                }}
              >
                <RefreshCcwIcon className={fetchModels.isPending ? "animate-spin" : undefined} />
              </Button>
            </div>
            {fetchModels.isError && (
              <p className="text-sm text-destructive">{fetchModels.error.message}</p>
            )}
            {models.length === 0 && (
              <p className="text-sm text-muted-foreground">No models added yet.</p>
            )}
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
                  onUpdateModelId={async (modelId) => {
                    await updateModel.mutateAsync({ id: model.id, modelId });
                  }}
                  onDelete={async () => {
                    await deleteModel.mutateAsync({ id: model.id });
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

type ModelRowProps = {
  model: AIModel;
  isFirst: boolean;
  isLast: boolean;
  isMoving: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onMove: (direction: ChangePositionDirection) => void;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateModelId: (modelId: string) => Promise<void>;
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
    onUpdateModelId,
    onDelete,
  } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-muted">
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{model.modelId}</p>
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
        modelId={model.modelId}
        isSaving={isUpdating}
        onSave={onUpdateModelId}
      />
      <DeleteModelAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        modelId={model.modelId}
        isDeleting={isDeleting}
        onConfirm={onDelete}
      />
    </div>
  );
}

function getProviderApiKeyDescription(providerName: string) {
  return `API key used to authenticate requests to ${providerName}.`;
}

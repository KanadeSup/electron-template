import { useAIProviders } from "@client/modules/ai-model/hooks/use-ai-providers";
import { useChangeAIProviderPosition } from "@client/modules/ai-model/hooks/use-change-ai-provider-position";
import { useUpdateAIProvider } from "@client/modules/ai-model/hooks/use-update-ai-provider";
import type { AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { getProviderIcon } from "@client/modules/ai-model/utils/ai-model.util";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { Switch } from "@client/modules/design-system/components/shadcn-ui/switch";
import type { ChangeAIProviderPositionRequest } from "@shared/contracts/ai-provider.contract";
import { cn } from "cn";
import { BotIcon, ChevronDownIcon, ChevronUpIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { AiModelProviderDetail } from "./ai-model-provider-detail";

export function AiModelSetting() {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const { providers, isLoading, error, refetch } = useAIProviders({ includeAIModels: true });
  const updateProvider = useUpdateAIProvider();
  const changePosition = useChangeAIProviderPosition();

  const selectedProvider = providers.find((provider) => provider.id === selectedProviderId);
  const sortedProviders = [...providers].sort((a, b) => a.sortOrder - b.sortOrder);

  if (isLoading) return null;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-center text-sm text-destructive">
          Something went wrong. Check the logs for more information.
        </p>
        <Button variant="default" size="sm" onClick={() => refetch()}>
          <RefreshCcwIcon />
          Retry
        </Button>
      </div>
    );
  }

  if (selectedProvider) {
    return (
      <AiModelProviderDetail
        provider={selectedProvider}
        onBack={() => setSelectedProviderId(null)}
      />
    );
  }

  if (sortedProviders.length === 0) {
    return <p className="text-sm text-muted-foreground">No providers yet.</p>;
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-2 pr-4">
        {sortedProviders.map((provider, index) => (
          <ProviderRow
            key={provider.id}
            provider={provider}
            isFirst={index === 0}
            isLast={index === sortedProviders.length - 1}
            isMoving={changePosition.isPending && changePosition.variables?.id === provider.id}
            isUpdating={updateProvider.isPending && updateProvider.variables?.id === provider.id}
            onSelect={() => setSelectedProviderId(provider.id)}
            onMove={(direction) => changePosition.mutate({ id: provider.id, direction })}
            onToggleEnabled={(enabled) => updateProvider.mutate({ id: provider.id, enabled })}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

type ProviderRowProps = {
  provider: AIProviderWithModels;
  isFirst: boolean;
  isLast: boolean;
  isMoving: boolean;
  isUpdating: boolean;
  onSelect: () => void;
  onMove: (direction: ChangeAIProviderPositionRequest["direction"]) => void;
  onToggleEnabled: (enabled: boolean) => void;
};

function ProviderRow(props: ProviderRowProps) {
  const { provider, isFirst, isLast, isMoving, isUpdating, onSelect, onMove, onToggleEnabled } =
    props;
  const ProviderIcon = getProviderIcon(provider.providerName) ?? BotIcon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        "rounded-xl border border-input",
        "bg-sidebar p-3 hover:bg-muted/40 hover:border-ring/50",
      )}
      onClick={onSelect}
    >
      <ProviderIcon className="w-4 h-4" />
      <p className="min-w-0 flex-1 truncate font-medium">{provider.providerLabel}</p>
      <div className="flex items-center gap-0.5" onClick={(event) => event.stopPropagation()}>
        <Button
          variant="secondary"
          size="icon"
          disabled={isFirst || isMoving}
          onClick={() => onMove("up")}
        >
          <ChevronUpIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          disabled={isLast || isMoving}
          onClick={() => onMove("down")}
        >
          <ChevronDownIcon />
        </Button>
      </div>
      <div onClick={(event) => event.stopPropagation()}>
        <Switch
          size="default"
          checked={provider.enabled}
          disabled={isUpdating}
          onCheckedChange={onToggleEnabled}
        />
      </div>
    </div>
  );
}

import { useAIProviders } from "@client/modules/ai-model/hooks/use-ai-providers";
import type { AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { getProviderIcon } from "@client/modules/ai-model/utils/ai-model.util";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { Switch } from "@client/modules/design-system/components/shadcn-ui/switch";
import { cn } from "cn";
import { BotIcon, ChevronDownIcon, ChevronUpIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { AiModelProviderDetail } from "./ai-model-provider-detail";

export function AiModelSetting() {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const { providers, isLoading, error, refetch } = useAIProviders({ includeAIModels: true });

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
            onSelect={() => setSelectedProviderId(provider.id)}
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
  onSelect: () => void;
};

function ProviderRow(props: ProviderRowProps) {
  const { provider, isFirst, isLast, onSelect } = props;
  const ProviderIcon = getProviderIcon(provider.providerId) ?? BotIcon;

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
      <p className="min-w-0 flex-1 truncate font-medium">{provider.providerName}</p>
      <div className="flex items-center gap-0.5" onClick={(event) => event.stopPropagation()}>
        <Button variant="secondary" size="icon" disabled={isFirst}>
          <ChevronUpIcon />
        </Button>
        <Button variant="secondary" size="icon" disabled={isLast}>
          <ChevronDownIcon />
        </Button>
      </div>
      <div onClick={(event) => event.stopPropagation()}>
        <Switch size="default" checked={provider.enabled} />
      </div>
    </div>
  );
}

import type { AIModel, AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { getProviderIcon } from "@client/modules/ai-model/utils/ai-model.util";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { Input } from "@client/modules/design-system/components/shadcn-ui/input";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { Switch } from "@client/modules/design-system/components/shadcn-ui/switch";
import {
  BotIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

export type AiModelProviderDetailProps = {
  provider: AIProviderWithModels;
  onBack: () => void;
};

export function AiModelProviderDetail(props: AiModelProviderDetailProps) {
  const { provider, onBack } = props;
  const ProviderIcon = getProviderIcon(provider.providerId) ?? BotIcon;
  const models = [...provider.models].sort((a, b) => a.sortOrder - b.sortOrder);
  const [apiKey, setApiKey] = useState("");

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
            <p className="text-sm font-semibold">API key</p>
            <Input
              type="password"
              value={apiKey}
              placeholder="Enter API key"
              onChange={(event) => setApiKey(event.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {getProviderApiKeyDescription(provider.providerName)}
            </p>
          </section>

          <section className="flex flex-col gap-2 rounded-xl border border-input bg-sidebar p-3">
            <p className="text-sm font-semibold">Models</p>
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
};

function ModelRow(props: ModelRowProps) {
  const { model, isFirst, isLast } = props;

  return (
    <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-muted">
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{model.modelId}</p>
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon-xs" disabled={isFirst}>
          <ChevronUpIcon />
        </Button>
        <Button variant="ghost" size="icon-xs" disabled={isLast}>
          <ChevronDownIcon />
        </Button>
        <Button variant="ghost" size="icon-xs">
          <PencilIcon />
        </Button>
        <Button variant="ghost" size="icon-xs" className="text-destructive">
          <Trash2Icon />
        </Button>
      </div>
      <Switch size="sm" checked={model.enabled} />
    </div>
  );
}

function getProviderApiKeyDescription(providerName: string) {
  return `API key used to authenticate requests to ${providerName}.`;
}

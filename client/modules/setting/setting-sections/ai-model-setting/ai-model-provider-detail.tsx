import { useCheckAPIKey } from "@client/modules/ai-model/hooks/use-check-api-key";
import { useUpdateAIProvider } from "@client/modules/ai-model/hooks/use-update-ai-provider";
import type { AIProviderWithModels } from "@client/modules/ai-model/types/ai-model.type";
import { getProviderIcon } from "@client/modules/ai-model/utils/ai-model.util";
import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { PasswordInput } from "@client/modules/design-system/components/shadcn-ui/password-input";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import type { CheckAPIKeyResponse } from "@shared/contracts/ai-provider.contract";
import { BotIcon, CheckIcon, ChevronLeftIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { AiModelList } from "./ai-model-list";

export type AiModelProviderDetailProps = {
  provider: AIProviderWithModels;
  onBack: () => void;
};

export function AiModelProviderDetail(props: AiModelProviderDetailProps) {
  const { provider, onBack } = props;
  const ProviderIcon = getProviderIcon(provider.providerName) ?? BotIcon;
  const [apiKey, setApiKey] = useState(provider.apiKey);
  const [isApiKeyDirty, setIsApiKeyDirty] = useState(false);
  const [apiKeyValidation, setApiKeyValidation] = useState<CheckAPIKeyResponse | null>(null);
  const updateProvider = useUpdateAIProvider();
  const checkAPIKey = useCheckAPIKey();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-1 pr-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack}>
          <ChevronLeftIcon />
        </Button>
        <ProviderIcon className="w-4 h-4" />
        <p className="font-semibold">{provider.providerLabel}</p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 pr-4">
          <section className="flex flex-col gap-2 rounded-xl border border-input bg-sidebar p-3">
            <p className="text-base font-semibold">API key</p>
            <p className="text-sm text-muted-foreground">
              {getProviderApiKeyDescription(provider.providerLabel)}
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
                    providerId: provider.providerName,
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

          <AiModelList
            provider={provider}
            isRefreshDisabled={updateProvider.isPending}
            onBeforeRefresh={async () => {
              if (!isApiKeyDirty) return;

              await updateProvider.mutateAsync({ id: provider.id, apiKey });
              setIsApiKeyDirty(false);
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

function getProviderApiKeyDescription(providerName: string) {
  return `API key used to authenticate requests to ${providerName}.`;
}

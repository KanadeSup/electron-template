import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@client/modules/design-system/components/shadcn-ui/popover";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { cn } from "cn";
import { BotIcon, RefreshCcwIcon } from "lucide-react";
import { useAiModels } from "../../hooks/use-ai-models";
import { getProviderIcon, groupModelsByProvider } from "../../utils/ai-model.util";

export type ModelSelectProps = {
  selectedModel?: string | null;
  onChange?: (model: string) => void;
};
export function ModelSelect(props: ModelSelectProps) {
  const { selectedModel, onChange } = props;

  const { models, error, refetch } = useAiModels({ enabled: true });
  return (
    <div>
      <Popover>
        <PopoverTrigger
          className={cn(
            "text-sm font-semibold cursor-pointer",
            "border-2 border-input rounded-xl p-1 px-2",
            "hover:border-ring text-muted-foreground",
          )}
        >
          Choose Model
        </PopoverTrigger>
        <PopoverContent align="start" className="border border-input text-sm p-1 w-80">
          {error && (
            <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
              <p className="text-sm text-center text-destructive">
                Something went wrong. Check the logs for more information.
              </p>
              <Button variant="default" size="sm" onClick={() => refetch()}>
                <RefreshCcwIcon className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}
          {!error && (
            <ScrollArea className="max-h-80">
              <div className="flex flex-col gap-2">
                {groupModelsByProvider(models).map((provider) => {
                  const ProviderIcon = getProviderIcon(provider.id) ?? BotIcon;
                  return (
                    <div
                      key={provider.id}
                      className={cn(
                        "flex flex-col bg-background/60 p-2 rounded-xl",
                        "font-semibold",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ProviderIcon className="w-4 h-4" />
                        <p className="text-muted-foreground">{provider.name}</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {provider.models.map((model) => (
                          <div
                            key={model.id}
                            className={cn(
                              "flex flex-col cursor-pointer mt-1",
                              "hover:bg-muted/80 p-1.5 rounded-md",
                              selectedModel === model.id && "bg-muted/80",
                            )}
                            onClick={() => onChange?.(model.id)}
                          >
                            <p>{model.id}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

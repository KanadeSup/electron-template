import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@client/modules/design-system/components/shadcn-ui/combobox";
import { cn } from "cn";
import { CircleSlash } from "lucide-react";
import { useState } from "react";

export function AssistantSelect() {
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  return (
    <Combobox onValueChange={setSelectedAssistant}>
      <ComboboxTrigger
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl p-2 bg-sidebar",
          "border border-input min-w-32",
        )}
      >
        <div className="flex items-center gap-2">
          <CircleSlash className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold">{selectedAssistant ?? "No assistant"}</p>
        </div>
      </ComboboxTrigger>
      <ComboboxContent className="p-1 border-input border">
        <ComboboxList>
          <ComboboxItem className="cursor-pointer text-base" value="assistant-1">
            Assistant 1
          </ComboboxItem>
          <ComboboxItem className="cursor-pointer text-base" value="assistant-2">
            Assistant 2
          </ComboboxItem>
          <ComboboxItem className="cursor-pointer text-base" value="assistant-3">
            Assistant 3
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

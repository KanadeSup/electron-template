import {
  COMMAND_DEFINITIONS,
  COMMAND_GROUPS,
} from "@client/modules/command/constants/command.constants";
import { ScrollArea } from "@client/modules/design-system/components/shadcn-ui/scroll-area";
import { KeyboardField } from "../../components/keyboard-field/keyboard-field";

export function KeyboardSetting() {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-4 pr-4">
        {COMMAND_GROUPS.map((commandGroup) => (
          <div key={commandGroup.groupId} className="bg-sidebar p-3 rounded-xl">
            <h3 className="text-base font-semibold mb-4">{commandGroup.groupLabel}</h3>
            <div className="flex flex-col gap-4">
              {COMMAND_DEFINITIONS.filter(
                (commandDefinition) => commandDefinition.groupId === commandGroup.groupId,
              ).map((commandDefinition) => (
                <KeyboardField
                  key={commandDefinition.commandId}
                  title={commandDefinition.commandLabel}
                  sequenceKey={null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

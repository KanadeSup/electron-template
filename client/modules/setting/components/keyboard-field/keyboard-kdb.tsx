import { Kbd } from "@client/modules/design-system/components/shadcn-ui/kbd";
import { cn } from "cn";

export type KeyboardKdbProps = {
  sequenceKeys: string[];
};

export function KeyboardKdb(props: KeyboardKdbProps) {
  const { sequenceKeys } = props;

  return (
    <div className="flex flex-row gap-1 flex-wrap">
      {sequenceKeys.map((sequenceKey) => (
        <Kbd
          key={sequenceKey}
          className={cn(
            "rounded-md px-2 py-4 text-base font-medium text-foreground",
            "border-2 border-border",
          )}
        >
          {sequenceKey}
        </Kbd>
      ))}
    </div>
  );
}

import { Kbd } from "@client/modules/design-system/components/shadcn-ui/kbd";
import { cn } from "cn";

export type KeyboardKdbProps = {
  sequenceKeys: string[];
  className?: string;
};

export function KeyboardKdb(props: KeyboardKdbProps) {
  const { sequenceKeys, className } = props;

  return (
    <div className="flex flex-row gap-1 flex-wrap">
      {sequenceKeys.map((sequenceKey, idx) => (
        <Kbd
          key={idx.toString()}
          className={cn("font-medium text-foreground", "border-2 border-border", className)}
        >
          {sequenceKey}
        </Kbd>
      ))}
    </div>
  );
}

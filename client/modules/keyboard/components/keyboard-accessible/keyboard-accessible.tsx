import type { GroupId } from "@client/modules/command/types/command.type";
import { cn } from "@client/modules/design-system/lib/utils";
import { useRegisterGroup } from "../../stores/keyboard-store";

export type KeyboardAccessibleProps = {
  groupId: GroupId;
  children: React.ReactNode;
  className?: string;
};

export function KeyboardAccessible(props: KeyboardAccessibleProps) {
  const { groupId, children, className } = props;

  const { isActive, error } = useRegisterGroup(groupId);

  if (error) {
    return <div className={cn("text-red-500", className)}>{error}</div>;
  }

  return (
    <div className={cn(isActive && "border-2 border-blue-500/40 rounded-lg", className)}>
      {children}
    </div>
  );
}

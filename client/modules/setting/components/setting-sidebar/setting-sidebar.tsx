import { Button } from "@client/modules/design-system/components/shadcn-ui/button";
import { cn } from "cn";
import { Bot, Keyboard, type LucideIcon, Palette, SlidersHorizontal } from "lucide-react";

export const SETTING_SECTIONS = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "keyboard", label: "Keyboard", icon: Keyboard },
  { id: "ai-model", label: "AI model", icon: Bot },
] as const;

export type SettingSection = (typeof SETTING_SECTIONS)[number];

export type SettingSectionId = (typeof SETTING_SECTIONS)[number]["id"];

export type SettingSidebarProps = {
  className?: string;
  selected: SettingSectionId;
  onSelect: (id: SettingSectionId) => void;
};

export function SettingSidebar(props: SettingSidebarProps) {
  const { className, selected, onSelect } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-1 py-2",
        "h-full w-full rounded-xl max-w-96",
        className,
      )}
    >
      <div className="flex items-center h-7 px-1.5">
        <h1 className="font-semibold text-base">Settings</h1>
      </div>

      <div className="flex flex-col gap-1">
        {SETTING_SECTIONS.map((section) => (
          <SettingItem
            key={section.id}
            icon={section.icon}
            label={section.label}
            isActive={selected === section.id}
            onClick={() => onSelect(section.id)}
          />
        ))}
      </div>
    </div>
  );
}

type SettingItemProps = {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function SettingItem(props: SettingItemProps) {
  const { icon: Icon, label, isActive, onClick } = props;

  return (
    <Button
      variant="ghost"
      className={cn("w-full flex items-center justify-start px-1.5 gap-2", isActive && "bg-muted")}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 stroke-foreground/70 stroke-[3px]" />
      <span className="font-medium">{label}</span>
    </Button>
  );
}

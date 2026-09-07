import { useState } from "react";
import { AppLayout } from "../design-system/components/app-layout/app-layout";
import {
  SETTING_SECTIONS,
  type SettingSectionId,
  SettingSidebar,
} from "./components/setting-sidebar/setting-sidebar";

export function SettingPage() {
  const [selected, setSelected] = useState<SettingSectionId>("general");
  const section = SETTING_SECTIONS.find((item) => item.id === selected) ?? SETTING_SECTIONS[0];

  return (
    <AppLayout className="flex gap-5">
      <div className="w-64 shrink-0">
        <SettingSidebar selected={selected} onSelect={setSelected} />
      </div>
      <div className="flex-1 overflow-hidden py-2">
        <p className="font-semibold">{section.label}</p>
      </div>
    </AppLayout>
  );
}

import type { CommandId } from "@client/modules/command/types/command.type";
import { create } from "zustand";

export type Keybinding = {
  commandId: CommandId;
  sequenceString: string | null;
  sequence: string[];
};

export type KeyboardStore = {
  keybindings: Keybinding[];
  isLoading: boolean;
  actions: {
    load(): Promise<void>;
    setKeybindings: (keybindings: Keybinding[]) => void;
    setSequenceByCommandId: (commandId: CommandId, sequence: string[] | null) => void;
  };
};

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  keybindings: [],
  isLoading: false,
  actions: {
    load: async () => {
      set({ isLoading: true });
      set({ keybindings: [], isLoading: false });
    },
    setKeybindings: (keybindings) => set({ keybindings }),
    setSequenceByCommandId: (commandId, sequence) =>
      set((state) => ({
        keybindings: state.keybindings.map((binding) =>
          binding.commandId === commandId ? { ...binding, sequence: sequence ?? [] } : binding,
        ),
      })),
  },
}));

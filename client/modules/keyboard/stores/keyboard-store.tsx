import type { CommandId } from "@client/modules/command/types/command.type";
import Logger from "electron-log/renderer.js";
import { create } from "zustand";
import { getMappedKeys, resetKey, setKey, unsetKey } from "../api/keyboard.api";
import {
  arrayifySequenceString,
  mapKeyCommandMappingsToKeybindings,
  normalizeSequenceString,
} from "../lib/keyboard";

export type Keybinding = {
  commandId: CommandId;
  sequenceString: string | null;
  sequence: string[];
};

export type KeyboardStore = {
  keybindings: Keybinding[];
  isLoading: boolean;
  actions: {
    load(): Promise<boolean>;
    setSequenceByCommandId: (commandId: CommandId, sequenceString: string) => Promise<boolean>;
    unsetSequenceByCommandId: (commandId: CommandId) => Promise<boolean>;
    resetSequenceByCommandId: (commandId: CommandId) => Promise<boolean>;
  };
};

const SCOPE = "useKeyboardStore";

export const useKeyboardStore = create<KeyboardStore>((set, get) => ({
  keybindings: [],
  isLoading: false,
  actions: {
    load: async (): Promise<boolean> => {
      set({ isLoading: true });
      const response = await getMappedKeys();
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to load keybindings", response.errorMessage);
        set({
          keybindings: mapKeyCommandMappingsToKeybindings([]),
          isLoading: false,
        });
        return false;
      }
      set({
        keybindings: mapKeyCommandMappingsToKeybindings(
          response.data.map((m) => ({
            commandId: m.command,
            sequenceString: m.key,
          })),
        ),
        isLoading: false,
      });
      return true;
    },

    setSequenceByCommandId: async (commandId, sequenceString): Promise<boolean> => {
      if (!sequenceString) {
        Logger.scope(SCOPE).error("Sequence string is required", commandId);
        return false;
      }

      const keybindings = get().keybindings;
      const foundBindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);

      if (foundBindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return false;
      }

      const normalizedSequenceString = normalizeSequenceString(sequenceString);

      const response = await setKey(normalizedSequenceString, commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to set sequence by command id", response.errorMessage);
        return false;
      }

      const newKeybindings = [...keybindings];
      newKeybindings[foundBindingIndex] = {
        ...newKeybindings[foundBindingIndex],
        sequenceString: normalizedSequenceString,
        sequence: arrayifySequenceString(normalizedSequenceString),
      };
      set({ keybindings: newKeybindings });

      return true;
    },

    unsetSequenceByCommandId: async (commandId): Promise<boolean> => {
      const keybindings = get().keybindings;
      const foundBindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);
      if (foundBindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return false;
      }

      const response = await unsetKey(commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to unset sequence by command id", response.errorMessage);
        return false;
      }

      const newKeybindings = [...keybindings];
      newKeybindings[foundBindingIndex] = {
        ...newKeybindings[foundBindingIndex],
        sequenceString: null,
        sequence: [],
      };
      set({ keybindings: newKeybindings });

      return true;
    },

    resetSequenceByCommandId: async (commandId): Promise<boolean> => {
      const keybindings = get().keybindings;
      const foundBindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);
      if (foundBindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return false;
      }

      const response = await resetKey(commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to reset sequence by command id", response.errorMessage);
        return false;
      }

      const newKeybindings = [...keybindings];
      newKeybindings[foundBindingIndex] = {
        ...newKeybindings[foundBindingIndex],
        sequenceString: null,
        sequence: [],
      };
      set({ keybindings: newKeybindings });

      return true;
    },
  },
}));

import type { CommandId, GroupId } from "@client/modules/command/types/command.type";
import Logger from "electron-log/renderer.js";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { getMappedKeys, resetKey, setKey, unsetKey } from "../api/keyboard.api";
import {
  buildingKeybindings,
  getDefaultSequence,
  normalizeSequence,
  sequenceToKeys,
} from "../lib/keyboard";

export type KeybindingOperationResult = {
  success: boolean;
  errorCode?: KeybindingOperationErrorCode;
  errorMessage?: string;
};

export type KeybindingOperationErrorCode =
  | "unexpected-error"
  | "missing-sequence"
  | "command-not-found";

export type Keybinding = {
  commandId: CommandId;
  groupId: GroupId;
  sequence: string | null;
  keys: string[];
};

export type KeyboardStore = {
  keybindings: Keybinding[];
  isLoading: boolean;
  activeGroupId: GroupId | null;
  availableGroups: GroupId[];
  actions: {
    load(): Promise<KeybindingOperationResult>;
    setKeybinding: (commandId: CommandId, sequence: string) => Promise<KeybindingOperationResult>;
    unsetKeybinding: (commandId: CommandId) => Promise<KeybindingOperationResult>;
    resetKeybinding: (commandId: CommandId) => Promise<KeybindingOperationResult>;
    registerGroup: (groupId: GroupId) => KeybindingOperationResult;
    unregisterGroup: (groupId: GroupId) => void;
  };
};

const SCOPE = "useKeyboardStore";

export const useKeyboardStore = create<KeyboardStore>((set, get) => ({
  keybindings: [],
  isLoading: false,
  activeGroupId: "chat",
  availableGroups: [],
  actions: {
    load: async () => {
      set({ isLoading: true });
      const response = await getMappedKeys();
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to load keybindings", response.errorMessage);
        set({
          keybindings: buildingKeybindings([]),
          isLoading: false,
        });
        return { success: false, errorCode: "unexpected-error" };
      }

      const keybindings = buildingKeybindings(
        response.data.map((m) => ({
          commandId: m.command,
          sequenceString: m.key,
        })),
      );
      set({
        keybindings,
        isLoading: false,
      });
      return { success: true };
    },

    setKeybinding: async (commandId, sequence) => {
      if (!sequence) {
        Logger.scope(SCOPE).error("Sequence string is required", commandId);
        return { success: false, errorCode: "missing-sequence" };
      }

      const keybindings = get().keybindings;
      const bindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);

      if (bindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return { success: false, errorCode: "command-not-found" };
      }

      const normalizedSequence = normalizeSequence(sequence);

      const response = await setKey(normalizedSequence, commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to set sequence by command id", response.errorMessage);
        return { success: false, errorCode: "unexpected-error" };
      }

      // Update keybinding in the store
      const updatedBinding = {
        ...keybindings[bindingIndex],
        sequence: normalizedSequence,
        keys: sequenceToKeys(normalizedSequence),
      };

      set({
        keybindings: keybindings.map((binding, index) =>
          index === bindingIndex ? updatedBinding : binding,
        ),
      });

      return { success: true };
    },

    unsetKeybinding: async (commandId) => {
      const keybindings = get().keybindings;
      const bindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);
      if (bindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return { success: false, errorCode: "command-not-found" };
      }

      const response = await unsetKey(commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to unset sequence by command id", response.errorMessage);
        return { success: false, errorCode: "unexpected-error" };
      }

      const updatedBinding = {
        ...keybindings[bindingIndex],
        sequence: null,
        keys: [],
      };
      set({
        keybindings: keybindings.map((binding, index) =>
          index === bindingIndex ? updatedBinding : binding,
        ),
      });

      return { success: true };
    },

    resetKeybinding: async (commandId) => {
      const keybindings = get().keybindings;
      const bindingIndex = keybindings.findIndex((binding) => binding.commandId === commandId);
      if (bindingIndex === -1) {
        Logger.scope(SCOPE).error("Command id not found", commandId);
        return { success: false, errorCode: "command-not-found" };
      }

      const response = await resetKey(commandId);
      if (!response.success) {
        Logger.scope(SCOPE).error("Failed to reset sequence by command id", response.errorMessage);
        return { success: false, errorCode: "unexpected-error" };
      }

      const defaultSequence = getDefaultSequence(commandId);

      const updatedBinding = {
        ...keybindings[bindingIndex],
        sequence: defaultSequence,
        keys: defaultSequence ? sequenceToKeys(defaultSequence) : [],
      };
      set({
        keybindings: keybindings.map((binding, index) =>
          index === bindingIndex ? updatedBinding : binding,
        ),
      });

      return { success: true };
    },

    registerGroup: (groupId) => {
      const availableGroups = get().availableGroups;
      if (availableGroups.includes(groupId)) {
        Logger.scope(SCOPE).error(`Group ${groupId} already registered. Skipping registration.`);
        return {
          success: false,
          errorMessage: `Group ${groupId} already registered.`,
        };
      }

      set((state) => ({
        availableGroups: [...state.availableGroups, groupId],
      }));

      return { success: true };
    },

    unregisterGroup: (groupId) => {
      set((state) => ({
        availableGroups: state.availableGroups.filter((group) => group !== groupId),
      }));
    },
  },
}));

export const useRegisterGroup = (groupId: GroupId) => {
  const actions = useKeyboardStore((state) => state.actions);
  const activeGroupId = useKeyboardStore((state) => state.activeGroupId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = actions.registerGroup(groupId);
    if (!result.success) {
      setError(result.errorMessage ?? "Something went wrong while registering the group.");
    }

    return () => actions.unregisterGroup(groupId);
  }, [groupId, actions]);

  return {
    isActive: activeGroupId === groupId,
    activeGroupId: activeGroupId,
    error: error,
  };
};

import { COMMAND_DEFINITIONS } from "@client/modules/command/constants/command.constants";
import type { Keybinding } from "../stores/keyboard-store";

export const MODIFIER_KEYS = ["ctrl", "alt", "shift", "meta"];

export const SPECIAL_KEYS = [
  "escape",
  "backspace",
  "delete",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "tab",
  "=",
  "-",
  "+",
];

export const ALLOWED_KEYS = [...MODIFIER_KEYS, ...SPECIAL_KEYS];

export type GetKeysFromEventOptions = {
  /** If the pressed keys are only modifer keys (ctrl, alt, shift, meta)
   * without any other keys, return an empty array.
   * */
  ignoreOnlyModifiers?: boolean;
};
export function getKeysFromEvent(
  event: KeyboardEvent,
  options: GetKeysFromEventOptions = {},
): string[] {
  const { ignoreOnlyModifiers = false } = options;

  const keys: string[] = [];

  // Add modifiers
  if (event.ctrlKey) keys.push("ctrl");
  if (event.altKey) keys.push("alt");
  if (event.shiftKey) keys.push("shift");
  if (event.metaKey) keys.push("meta");

  // Add normal key
  const rawKey = event.key.toLowerCase();

  if (!MODIFIER_KEYS.includes(rawKey) && isKeyAllowed(rawKey)) {
    keys.push(rawKey);
  }

  if (ignoreOnlyModifiers && MODIFIER_KEYS.includes(rawKey)) {
    return [];
  }

  return keys;
}

/**
 * Check if the key is allowed for shortcuts
 * Following keys are allowed:
 * - Modifier keys: ctrl, alt, shift, meta
 * - Special keys: escape, backspace, delete, arrowup, arrowdown, arrowleft, arrowright, tab
 * - a-z
 * - 0-9
 */
export function isKeyAllowed(key: string): boolean {
  const normalized = key.toLowerCase();

  if (ALLOWED_KEYS.includes(normalized)) {
    return true;
  }

  // Whether is A-Z
  if (/^[a-z]$/.test(normalized)) {
    return true;
  }

  // Whether is 0-9
  if (/^[0-9]$/.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Combines modifier keys and a normal key into a single string representation,
 * e.g., <ctrl-a> or <ctrl-alt-s>
 */
export function normalizeKeys(keys: string[]): string[] {
  const normalizedKeys: string[] = [];
  let scannedModifierKeys: string[] = [];

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    if (MODIFIER_KEYS.includes(currentKey)) {
      scannedModifierKeys.push(currentKey);
      continue;
    }

    if (scannedModifierKeys.length === 0) {
      normalizedKeys.push(currentKey);
      continue;
    }

    // Combine modifier keys and current key: <ctrl-a>, <ctrl-alt-s>
    const sortedModifierKeys = sortModifierKeys(scannedModifierKeys);
    const combinedKey = `<${sortedModifierKeys.join("-")}-${currentKey}>`;
    normalizedKeys.push(combinedKey);

    // Reset scanned modifier keys
    scannedModifierKeys = [];
  }
  return normalizedKeys;
}

/**
 * Sort modifier keys (ctrl -> shift -> alt -> meta)
 */
export function sortModifierKeys(keys: string[]): string[] {
  return [...keys]
    .map((key) => key.toLowerCase())
    .sort((a, b) => {
      return MODIFIER_KEYS.indexOf(a) - MODIFIER_KEYS.indexOf(b);
    });
}

/** Stringify an array of shortcut keys. */
export function keysToSequence(keys: string[]): string {
  return normalizeKeys(keys).join("");
}

export type KeybindingMatchResult =
  | {
      type: "none";
    }
  | {
      type: "prefix";
    }
  | {
      type: "match";
      keybinding: Keybinding;
    };

export function matchKeybinding(
  sequenceString: string,
  keybindings: Keybinding[],
): KeybindingMatchResult {
  if (!sequenceString) return { type: "none" };

  for (const keybinding of keybindings) {
    if (keybinding.sequence === sequenceString) {
      return { type: "match", keybinding };
    }
    if (!keybinding.sequence) continue;
    if (keybinding.sequence.startsWith(sequenceString)) {
      return { type: "prefix" };
    }
  }

  return { type: "none" };
}

export type SequenceMapping = {
  commandId: string;
  sequenceString: string | null;
};

/**
 * Building full keybindings
 */
export function buildingKeybindings(mappings: SequenceMapping[]): Keybinding[] {
  const keybindings: Keybinding[] = [];
  COMMAND_DEFINITIONS.forEach((commandDef) => {
    const mapping = mappings.find((m) => m.commandId === commandDef.commandId);
    if (mapping) {
      const normalizedSequenceString = mapping.sequenceString
        ? normalizeSequence(mapping.sequenceString)
        : null;
      keybindings.push({
        commandId: commandDef.commandId,
        groupId: commandDef.groupId,
        sequence: normalizedSequenceString,
        keys: normalizedSequenceString ? sequenceToKeys(normalizedSequenceString) : [],
      });
      return;
    }
    const defaultSequenceString = commandDef.defaultSequenceKey
      ? normalizeSequence(commandDef.defaultSequenceKey)
      : null;
    keybindings.push({
      commandId: commandDef.commandId,
      groupId: commandDef.groupId,
      sequence: defaultSequenceString,
      keys: defaultSequenceString ? sequenceToKeys(defaultSequenceString) : [],
    });
  });
  return keybindings;
}

export type SequenceToKeysOptions = {
  normalize?: boolean;
};
export function sequenceToKeys(sequence: string, options: SequenceToKeysOptions = {}): string[] {
  const { normalize = true } = options;
  if (normalize) {
    sequence = normalizeSequence(sequence);
  }
  const regex = /<[^>]+>|./g;
  return sequence.match(regex) || [];
}

export function normalizeSequence(sequence: string): string {
  return sequence.replace(/<([^>]+)>/g, (_, key: string) => {
    const parts = key.split("-");

    const modifiers = parts.filter((part) => MODIFIER_KEYS.includes(part));

    const keys = parts.filter((part) => !MODIFIER_KEYS.includes(part));

    modifiers.sort((a, b) => MODIFIER_KEYS.indexOf(a) - MODIFIER_KEYS.indexOf(b));

    return `<${[...modifiers, ...keys].join("-")}>`;
  });
}

export function getDefaultSequence(commandId: string): string | null {
  const commandDef = COMMAND_DEFINITIONS.find((def) => def.commandId === commandId);
  if (!commandDef) return null;
  return commandDef.defaultSequenceKey ? normalizeSequence(commandDef.defaultSequenceKey) : null;
}

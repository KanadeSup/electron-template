import { useCallback, useEffect, useRef } from "react";
import { getKeysFromEvent, matchKeybinding, stringifyShortcutKeys } from "../lib/keyboard";
import { useKeyboardStore } from "../stores/keyboard-store";

type KeyboardProviderProps = {
  children: React.ReactNode;
};

export function KeyboardProvider(props: KeyboardProviderProps) {
  const { children } = props;

  const bufferRef = useRef<string[]>([]);

  const keybindings = useKeyboardStore((state) => state.keybindings);
  const actions = useKeyboardStore((state) => state.actions);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const pressedKeys = getKeysFromEvent(event, { ignoreOnlyModifiers: true });
      const sequenceString = stringifyShortcutKeys(pressedKeys);
      const matchResult = matchKeybinding(sequenceString, keybindings);
      if (matchResult.type === "none") return;

      event.preventDefault();
      event.stopPropagation();

      if (matchResult.type === "prefix") {
        bufferRef.current.push(sequenceString);
        return;
      }
      matchResult.keybinding;
      console.log(matchKeybinding);
    },
    [keybindings],
  );

  useEffect(() => {
    actions.load();
  }, [actions]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return children;
}

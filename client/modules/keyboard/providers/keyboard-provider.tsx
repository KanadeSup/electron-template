import { useCommandStore } from "@client/modules/command/stores/command-store";
import { useCallback, useEffect, useRef } from "react";
import { getKeysFromEvent, keysToSequence, matchKeybinding } from "../lib/keyboard";
import { useKeyboardStore } from "../stores/keyboard-store";

type KeyboardProviderProps = {
  children: React.ReactNode;
};

export function KeyboardProvider(props: KeyboardProviderProps) {
  const { children } = props;

  const bufferRef = useRef<string[]>([]);

  const keybindings = useKeyboardStore((state) => state.keybindings);
  const actions = useKeyboardStore((state) => state.actions);
  const dispatch = useCommandStore((state) => state.actions.dispatch);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      const pressedKeys = getKeysFromEvent(event, { ignoreOnlyModifiers: true });
      const sequence = keysToSequence(pressedKeys);

      bufferRef.current.push(sequence);
      const matchResult = matchKeybinding(keysToSequence(bufferRef.current), keybindings);
      if (matchResult.type === "none") {
        bufferRef.current = [];
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (matchResult.type === "prefix") {
        return;
      }
      dispatch(matchResult.keybinding.commandId);
      bufferRef.current = [];
    },
    [keybindings, dispatch],
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

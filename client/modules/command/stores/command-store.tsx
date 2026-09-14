import Logger from "electron-log/renderer.js";
import { useEffect } from "react";
import { create } from "zustand";
import type { CommandId } from "../types/command.type";

export type CommandSubscription = {
  commandId: CommandId;
  handler: () => void;
};

type Unsubscribe = () => void;

export type CommandStore = {
  subscriptions: CommandSubscription[];
  actions: {
    subcribeCommand: (commandId: CommandId, handler: () => void) => Unsubscribe;
    unsubscribeCommand: (commandId: CommandId) => void;
    dispatch: (commandId: CommandId) => void;
  };
};

const SCOPE = "useCommandStore";

export const useCommandStore = create<CommandStore>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  actions: {
    subcribeCommand: (commandId, handler) => {
      const subscriptions = get().subscriptions;
      const subscription = subscriptions.find(
        (subscription) => subscription.commandId === commandId,
      );
      if (subscription) {
        Logger.scope(SCOPE).error(
          `Command ${commandId} already subscribed. The subscription will be ignored.`,
        );
        return () => {};
      }
      set((state) => ({
        subscriptions: [...state.subscriptions, { commandId, handler: handler }],
      }));
      return () => {
        set((state) => ({
          subscriptions: state.subscriptions.filter(
            (subscription) => subscription.commandId !== commandId,
          ),
        }));
      };
    },
    unsubscribeCommand: (commandId) => {
      set((state) => ({
        subscriptions: state.subscriptions.filter(
          (subscription) => subscription.commandId !== commandId,
        ),
      }));
    },
    dispatch: (commandId) => {
      const subscriptions = get().subscriptions;
      const subscription = subscriptions.find(
        (subscription) => subscription.commandId === commandId,
      );
      if (!subscription) return;

      try {
        subscription.handler();
      } catch (error) {
        Logger.scope(SCOPE).error(`Error in handler for command ${commandId}`, error);
      }
    },
  },
}));

export const useSubscribeCommand = (commandId: CommandId, handler: () => void) => {
  const actions = useCommandStore((state) => state.actions);

  useEffect(() => {
    return actions.subcribeCommand(commandId, handler);
  }, [commandId, actions, handler]);
};

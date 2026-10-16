import type { CommandId, GroupId } from "../types/command.type";

export type CommandGroup = {
  groupId: GroupId;
  groupLabel: string;
};

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    groupId: "general",
    groupLabel: "General",
  },
  {
    groupId: "app-sidebar",
    groupLabel: "App Sidebar",
  },
  {
    groupId: "chat",
    groupLabel: "Chat",
  },
  {
    groupId: "input-mode",
    groupLabel: "Input Mode",
  },
];

export type CommandDefinition = {
  commandId: CommandId;
  commandLabel: string;
  groupId: GroupId;
  defaultSequenceKey: string | null;
};

export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  {
    commandId: "general.scroll-down",
    commandLabel: "Scroll Down",
    groupId: "general",
    defaultSequenceKey: "j",
  },
  {
    commandId: "general.scroll-up",
    commandLabel: "Scroll Up",
    groupId: "general",
    defaultSequenceKey: "k",
  },
  {
    commandId: "general.focus-input",
    commandLabel: "Focus Input",
    groupId: "general",
    defaultSequenceKey: "i",
  },
  // App Sidebar
  {
    commandId: "app-sidebar.toggle",
    commandLabel: "Toggle App Sidebar",
    groupId: "app-sidebar",
    defaultSequenceKey: "b",
  },
  // Chat
  {
    commandId: "chat.new-conversation",
    commandLabel: "New Conversation",
    groupId: "chat",
    defaultSequenceKey: "n",
  },
  // Input Mode
  {
    commandId: "input-mode.exit-input-mode",
    commandLabel: "Exit Input Mode",
    groupId: "input-mode",
    defaultSequenceKey: "jj",
  },
];

export const COMMAND_BY_GROUP_ID_MAP = COMMAND_DEFINITIONS.reduce(
  (acc, commandDefinition) => {
    acc[commandDefinition.groupId] = commandDefinition;
    return acc;
  },
  {} as Record<GroupId, CommandDefinition>,
);

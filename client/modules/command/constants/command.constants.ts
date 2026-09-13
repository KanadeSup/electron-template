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
    commandId: "app-sidebar.toggle",
    commandLabel: "Toggle App Sidebar",
    groupId: "app-sidebar",
    defaultSequenceKey: "b",
  },
];

export const COMMAND_BY_GROUP_ID_MAP = COMMAND_DEFINITIONS.reduce(
  (acc, commandDefinition) => {
    acc[commandDefinition.groupId] = commandDefinition;
    return acc;
  },
  {} as Record<GroupId, CommandDefinition>,
);

export type CommandId =
  | "general.scroll-down"
  | "general.scroll-up"
  | "app-sidebar.toggle"
  | "app-sidebar.toggle-and-focus"
  | "chat.scroll-down"
  | "chat.scroll-up"
  | "chat.new-conversation"
  | "chat.focus-input"
  | "chat-input.exit-focus";

export type GroupId = "general" | "app-sidebar" | "chat" | "chat-input";

export const conversationKey = {
  all: ["conversation"] as const,
  lists: () => [...conversationKey.all, "list"] as const,
  list: () => [...conversationKey.lists()] as const,
};

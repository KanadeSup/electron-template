export type DisplayUserMessage = {
  id: number;

  type: "user";
  content: string;

  createdAt: Date;
  updatedAt: Date;
};

export type DisplayAssistantMessage<T extends "assistant" | "think"> = {
  id?: number;

  type: T;
  content: string;

  isGenerating: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};

export type DisplayErrorMessage = {
  id?: number;

  type: "error";
  errorMessage?: string | null;
  errorCode?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
};

export type DisplayMessage =
  | DisplayUserMessage
  | DisplayAssistantMessage<"assistant">
  | DisplayAssistantMessage<"think">
  | DisplayErrorMessage;

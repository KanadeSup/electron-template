export type DisplayUserMessage = {
  id: number;

  type: "user";
  content: string;

  createdAt: Date;
  updatedAt: Date;
};

export type DisplayAssistantMessage = {
  id?: number;

  type: "assistant" | "think";
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

export type DisplayMessage = DisplayUserMessage | DisplayAssistantMessage | DisplayErrorMessage;

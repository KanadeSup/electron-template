export type AIProvider = {
  id: AIProviderId;
  name: string;
};

export type AIProviderId = "openai" | "anthropic" | "gemini" | "xai" | "open-router";

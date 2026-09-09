export type ClientOptions = {
  /** If not provided, the API key will be retrieved from the API key storage */
  apiKey?: string;
};

export type GenerateTextOptions = {
  model: string;
  maxTokens?: number;
  thinkingLevel?: "minimal" | "low" | "medium" | "high" | "extreme";
  systemInstruction?: string;
  // biome-ignore lint/suspicious/noExplicitAny: Because the history is different for each client
  history?: any;
};

export type GenerateTextInput = string;

export type GenerateTextStreamOutput =
  | { type: "thinking.start" }
  | { type: "thinking.delta"; text: string }
  | { type: "thinking.end" }
  | { type: "model_output.start" }
  | { type: "model_output.delta"; text: string }
  | { type: "model_output.end" }
  | {
      type: "interaction.completed";
      inputTokens?: number;
      outputTokens?: number;
      thinkingTokens?: number;
      // biome-ignore lint/suspicious/noExplicitAny: Because the history is different for each client
      history?: any;
    };

export type ValidateApiKeyResponse = {
  valid: boolean;
  message: string | null;
};

export type ModelResponse = {
  modelName: string;
};

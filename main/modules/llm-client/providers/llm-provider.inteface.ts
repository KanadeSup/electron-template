import type {
  GenerateTextInput,
  GenerateTextOptions,
  GenerateTextStreamOutput,
  ModelResponse,
  SendChatMessageOptions,
  ValidateApiKeyResponse,
} from "../types/llm-client.type";

export interface LLMClient {
  readonly name: string;

  generateText(input: GenerateTextInput, options: GenerateTextOptions): Promise<string>;

  generateTextStream(
    input: GenerateTextInput,
    options: GenerateTextOptions,
  ): AsyncGenerator<GenerateTextStreamOutput>;

  sendChatMessage(
    message: string,
    options: SendChatMessageOptions,
  ): AsyncGenerator<GenerateTextStreamOutput>;

  validateAPIKey(apiKey: string): Promise<ValidateApiKeyResponse>;

  getModelList(): Promise<ModelResponse[]>;

  getApiKey(): string | null;
}

import type {
  GenerateTextInput,
  GenerateTextOptions,
  GenerateTextStreamOutput,
  ModelResponse,
  SendChatMessageOptions,
  ValidateApiKeyResponse,
} from "../types/provider.type";

export interface LlmProvider {
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

  validateApiKey(apiKey: string): Promise<ValidateApiKeyResponse>;

  getModelList(): Promise<ModelResponse[]>;

  getApiKey(): string | null;
}

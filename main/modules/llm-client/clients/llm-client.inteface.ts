import type {
  GenerateTextInput,
  GenerateTextOptions,
  GenerateTextStreamOutput,
  ModelResponse,
  ValidateApiKeyResponse,
} from "../types/llm-client.type";

export interface LLMClient {
  readonly name: string;

  generateText(input: GenerateTextInput, options: GenerateTextOptions): Promise<string>;

  generateTextStream(
    input: GenerateTextInput,
    options: GenerateTextOptions,
  ): AsyncGenerator<GenerateTextStreamOutput>;

  validateAPIKey(apiKey: string): Promise<ValidateApiKeyResponse>;

  getModelList(): Promise<ModelResponse[]>;

  getApiKey(): string | null;
}

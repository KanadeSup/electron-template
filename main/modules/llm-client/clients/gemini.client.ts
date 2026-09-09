import { GoogleGenAI } from "@google/genai";
import { ApiKeyService } from "@main/modules/ai-model/services/api-key.service";
import Logger from "electron-log/main.js";
import { KeyNotFoundError } from "../errors/key-not-found.error";
import type {
  ClientOptions,
  GenerateTextInput,
  GenerateTextOptions,
  GenerateTextStreamOutput,
  ModelResponse,
  SendChatMessageOptions,
  ValidateApiKeyResponse,
} from "../types/llm-client.type";
import type { LLMClient } from "./llm-client.inteface";

const SCOPE = "GeminiClient";

export class GeminiClient implements LLMClient {
  readonly name = "gemini" as const;
  private readonly client: GoogleGenAI;
  private readonly apiKeyService = new ApiKeyService();

  readonly excludedModelKeywords = [
    // Audio model
    "-tts",
    "-audio",
    "-live",
    "-transcribe",

    // Embedding model
    "-embedding",
    "-robotics",

    // Video model
    "-omni",
    "veo-",

    // Image model
    "-image",
    "imagen-",

    // Music model
    "lyria-",

    // Tool model
    "-computer",
    "customtools",
  ];

  constructor(options: ClientOptions) {
    const apiKey = options.apiKey && options.apiKey.length > 0 ? options.apiKey : this.getApiKey();

    if (!apiKey) {
      throw new KeyNotFoundError("Gemini API key not found");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async generateText(input: GenerateTextInput, options: GenerateTextOptions): Promise<string> {
    const response = await this.client.interactions.create({
      model: options.model,
      store: false,
      input: input,
      generation_config: {
        max_output_tokens: options.maxTokens,
      },
    });

    return response.output_text ?? "";
  }

  async *generateTextStream(
    input: GenerateTextInput,
    options: GenerateTextOptions,
  ): AsyncGenerator<GenerateTextStreamOutput> {
    const stream = await this.client.interactions.create({
      model: options.model,
      store: false,
      input: input,
      stream: true,
      generation_config: {
        max_output_tokens: options.maxTokens,
      },
    });

    let isThinking = false;
    let isGenerating = false;
    for await (const event of stream) {
      // Start event
      if (event.event_type === "step.start") {
        if (event.step.type === "thought") {
          yield { type: "thinking.start" };
          isThinking = true;
        }
        if (event.step.type === "model_output") {
          yield { type: "model_output.start" };
          isGenerating = true;
        }
      }

      // Delta event
      if (event.event_type === "step.delta") {
        // Thinking delta
        if (event.delta.type === "thought_summary") {
          if (event.delta.content?.type !== "text") continue;
          yield {
            type: "thinking.delta",
            text: event.delta.content.text,
          };
        }

        // Model output delta
        if (event.delta.type === "text") {
          yield {
            type: "model_output.delta",
            text: event.delta.text,
          };
        }
      }

      // End event
      if (event.event_type === "step.stop") {
        if (isThinking) {
          isThinking = false;
          yield { type: "thinking.end" };
        }
        if (isGenerating) {
          isGenerating = false;
          yield { type: "model_output.end" };
        }
      }

      // Complete event
      if (event.event_type === "interaction.completed") {
        const usage = event.interaction.usage;
        yield {
          type: "interaction.completed",
          inputTokens: usage?.total_input_tokens,
          outputTokens: usage?.total_output_tokens,
          thinkingTokens: usage?.total_thought_tokens,
        };
      }
    }
  }

  async *sendChatMessage(
    message: string,
    options: SendChatMessageOptions,
  ): AsyncGenerator<GenerateTextStreamOutput> {
    yield { type: "thinking.start" };
  }

  async validateAPIKey(apiKey: string): Promise<ValidateApiKeyResponse> {
    const validateClient = new GoogleGenAI({ apiKey });

    try {
      await validateClient.models.list();
      return {
        valid: true,
        message: null,
      };
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getModelList(): Promise<ModelResponse[]> {
    Logger.scope(SCOPE).info("Getting model list ...");
    const listResult = await this.client.models.list();
    const firstPageModels = listResult.page;
    const secondPageModels = await listResult.nextPage();
    const models = [...firstPageModels, ...secondPageModels];

    Logger.scope(SCOPE).info(`Found ${models.length} models`);

    const modelList: ModelResponse[] = [];
    models.forEach((model) => {
      if (!model.name?.startsWith("models/")) return;
      if (!model.supportedActions?.includes("generateContent")) return;

      const modelName = model.name.split("/")[1];

      // Filter by model name
      if (!modelName.startsWith("gemini-")) return;
      if (this.excludedModelKeywords.some((keyword) => modelName.includes(keyword))) return;

      modelList.push({
        modelName,
      });
    });
    return modelList.sort((a, b) => b.modelName.localeCompare(a.modelName));
  }

  getApiKey(): string | null {
    return this.apiKeyService.getApiKeyByProviderName("gemini");
  }
}

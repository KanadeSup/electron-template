import { GoogleGenAI, type Interactions } from "@google/genai";
import { ApiKeyService } from "@main/modules/ai-model/services/api-key.service";
import Logger from "electron-log/main.js";
import { KeyNotFoundError } from "../errors/key-not-found.error";
import type {
  ClientOptions,
  GenerateTextInput,
  GenerateTextOptions,
  GenerateTextStreamOutput,
  ModelResponse,
  ValidateApiKeyResponse,
} from "../types/llm-client.type";
import type { LLMClient } from "./llm-client.inteface";

type StreamState = {
  currentStep: Interactions.Step | null;
  history: Interactions.Step[];
};

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
    const history: Interactions.Step[] = options.history ?? [];
    history.push({
      type: "user_input",
      content: [{ type: "text", text: input }],
    });

    const stream = await this.client.interactions.create({
      model: options.model,
      store: false,
      input: history,
      stream: true,
      generation_config: {
        max_output_tokens: options.maxTokens,
        thinking_summaries: "auto",
      },
    });

    const streamState: StreamState = {
      currentStep: null,
      history: [],
    };
    for await (const event of stream) {
      Logger.scope(SCOPE).info("Stream Event", event);
      // Start event
      switch (event.event_type) {
        case "step.start":
          yield* this.handleStepStart(event, streamState);
          break;
        case "step.delta":
          yield* this.handleStepDelta(event, streamState);
          break;
        case "step.stop":
          yield* this.handleStepStop(event, streamState);
          break;
        case "interaction.completed":
          yield* this.handleInteractionCompleted(event, streamState);
          break;
      }
    }
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

  private *handleStepStart(
    event: Interactions.StepStart,
    streamState: StreamState,
  ): Generator<GenerateTextStreamOutput> {
    switch (event.step.type) {
      case "thought":
        yield { type: "thinking.start" };
        streamState.currentStep = {
          type: "thought",
        };
        break;

      case "model_output":
        yield { type: "model_output.start" };
        streamState.currentStep = {
          type: "model_output",
        };
        break;
      default:
        Logger.scope(SCOPE).warn("Unknown start step type", event.step.type);
        break;
    }
  }

  private *handleStepDelta(
    event: Interactions.StepDelta,
    streamState: StreamState,
  ): Generator<GenerateTextStreamOutput> {
    switch (event.delta.type) {
      case "thought_summary":
        if (streamState.currentStep?.type !== "thought") {
          Logger.scope(SCOPE).error(
            `The delta is 'thought_summary' but the current step is ${streamState.currentStep?.type ?? "null"}`,
          );
          break;
        }
        if (!event.delta.content) break;
        if (event.delta.content.type === "text") {
          yield { type: "thinking.delta", text: event.delta.content.text };

          // Update stream state for thinking summary
          const lastestSumary = streamState.currentStep.summary?.at(-1);
          if (lastestSumary?.type !== "text") {
            streamState.currentStep.summary = [
              {
                type: "text",
                text: event.delta.content.text,
              },
            ];
            break;
          }
          lastestSumary.text += event.delta.content.text;
        }
        break;
      case "thought_signature":
        if (streamState.currentStep?.type !== "thought") {
          Logger.scope(SCOPE).error(
            `The delta is 'thought_signature' but the current step is ${streamState.currentStep?.type ?? "null"}`,
          );
          break;
        }

        streamState.currentStep.signature = event.delta.signature;
        break;
      case "text": {
        if (streamState.currentStep?.type !== "model_output") {
          Logger.scope(SCOPE).error(
            `The delta is 'text' but the current step is ${streamState.currentStep?.type ?? "null"}`,
          );
          break;
        }
        yield { type: "model_output.delta", text: event.delta.text };
        const latestContent = streamState.currentStep.content?.at(-1);
        if (latestContent?.type !== "text") {
          streamState.currentStep.content = [
            {
              type: "text",
              text: event.delta.text,
            },
          ];
        } else {
          latestContent.text += event.delta.text;
        }
        break;
      }
      default:
        Logger.scope(SCOPE).warn("Unknown step delta type:", event.delta.type);
        break;
    }
  }

  private *handleStepStop(
    _event: Interactions.StepStop,
    streamState: StreamState,
  ): Generator<GenerateTextStreamOutput> {
    if (!streamState.currentStep) return;

    switch (streamState.currentStep.type) {
      case "thought":
        yield { type: "thinking.end" };
        streamState.history.push(streamState.currentStep);
        break;
      case "model_output":
        yield { type: "model_output.end" };
        streamState.history.push(streamState.currentStep);
        break;
      default:
        Logger.scope(SCOPE).warn("Unknown step stop type", streamState.currentStep.type);
        break;
    }
  }

  private *handleInteractionCompleted(
    event: Interactions.InteractionCompletedEvent,
    streamState: StreamState,
  ): Generator<GenerateTextStreamOutput> {
    yield { type: "interaction.completed" };
    const usage = event.interaction.usage;
    yield {
      type: "interaction.completed",
      inputTokens: usage?.total_input_tokens,
      outputTokens: usage?.total_output_tokens,
      thinkingTokens: usage?.total_thought_tokens,
      history: streamState.history,
    };
  }
}

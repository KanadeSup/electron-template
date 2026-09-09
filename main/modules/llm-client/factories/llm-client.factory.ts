import { GeminiClient } from "../providers/gemini.provider";
import type { LLMClient } from "../providers/llm-provider.inteface";
import type { ClientOptions } from "../types/llm-client.type";

export class LLMClientFactory {
  getClient(name: string, options: ClientOptions): LLMClient {
    switch (name) {
      case "gemini":
        return new GeminiClient(options);
      default: {
        throw new Error(`Unknown LLM provider: ${name}`);
      }
    }
  }
}

import { GeminiClient } from "../clients/gemini.client";
import type { LLMClient } from "../clients/llm-client.inteface";
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

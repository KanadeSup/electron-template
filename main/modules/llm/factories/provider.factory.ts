import { GeminiProvider } from "../providers/gemini.provider";
import type { LlmProvider } from "../providers/llm-provider.inteface";
import type { ProviderOptions } from "../types/provider.type";

export class LlmProviderFactory {
  getProvider(name: string, options: ProviderOptions): LlmProvider {
    switch (name) {
      case "gemini":
        return new GeminiProvider(options);
      default: {
        throw new Error(`Unknown LLM provider: ${name}`);
      }
    }
  }
}

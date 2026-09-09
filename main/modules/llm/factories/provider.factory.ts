import { GeminiProvider } from "../providers/gemini.provider";
import type { LLMProvider } from "../providers/llm-provider.inteface";
import type { ProviderOptions } from "../types/provider.type";

export class LLMProviderFactory {
  getProvider(name: string, options: ProviderOptions): LLMProvider {
    switch (name) {
      case "gemini":
        return new GeminiProvider(options);
      default: {
        throw new Error(`Unknown LLM provider: ${name}`);
      }
    }
  }
}

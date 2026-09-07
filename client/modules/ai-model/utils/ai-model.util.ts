import { GeminiIcon, GrokIcon, OpenAIIcon } from "@client/modules/icon/components/brand-icon";
import { AI_PROVIDERS } from "@shared/ai-model/constants/ai-model.constant";
import type { AIModel } from "../types/ai-model.type";

/**
 * This will return the full list of ai providers
 * each provider will have its own list of models
 */
export function groupModelsByProvider(models: AIModel[]) {
  return AI_PROVIDERS.map((provider) => ({
    id: provider.id,
    name: provider.name,
    models: models.filter((model) => model.provider === provider.id),
  }));
}

export function getProviderIcon(provider: string) {
  switch (provider) {
    case "openai":
      return OpenAIIcon;
    case "xai":
      return GrokIcon;
    case "gemini":
      return GeminiIcon;
    default:
      return null;
  }
}

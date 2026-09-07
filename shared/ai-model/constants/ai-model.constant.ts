import type { AIProvider } from "../types/ai-model.type";

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
  },
  {
    id: "anthropic",
    name: "Anthropic",
  },
  {
    id: "gemini",
    name: "Gemini",
  },
  {
    id: "xai",
    name: "XAI",
  },
  {
    id: "open-router",
    name: "OpenRouter",
  },
];

export const AI_PROVIDER_IDS = AI_PROVIDERS.map((provider) => provider.id);

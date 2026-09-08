import { GeminiIcon, GrokIcon, OpenAIIcon } from "@client/modules/icon/components/brand-icon";

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

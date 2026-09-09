import { AIProviderRepository } from "../repositories/ai-provider.repository";

export class ApiKeyService {
  private readonly aiProviderRepository = new AIProviderRepository();

  getApiKeyByProviderId(providerId: string): string {
    return this.aiProviderRepository.getApiKeyByProviderId(providerId);
  }
}

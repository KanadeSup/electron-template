import { AIProviderRepository } from "../repositories/ai-provider.repository";

export class ApiKeyService {
  private readonly aiProviderRepository = new AIProviderRepository();

  getApiKeyByProviderName(providerName: string): string {
    return this.aiProviderRepository.getAPIKeyByProviderName(providerName);
  }
}

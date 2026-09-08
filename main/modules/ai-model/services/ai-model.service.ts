import type {
  AIProviderInputDto,
  AIProviderOutputDto,
  GetAIModelsInputDto,
  GetAIModelsOutputDto,
} from "../dto/ai-model.dto";
import { AIModelRepository } from "../repositories/ai-model.repository";

export class AIModelService {
  private readonly aiModelRepository: AIModelRepository = new AIModelRepository();

  async getAIProviders(dto: AIProviderInputDto): Promise<AIProviderOutputDto[]> {
    return this.aiModelRepository.getAIProviders(dto);
  }

  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    return this.aiModelRepository.getAIModels(dto);
  }
}

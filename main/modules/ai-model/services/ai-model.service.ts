import type { GetAIModelsInputDto, GetAIModelsOutputDto } from "../dto/ai-model.dto";
import { AIModelRepository } from "../repositories/ai-model.repository";

export class AIModelService {
  private readonly aiModelRepository: AIModelRepository = new AIModelRepository();
  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    return this.aiModelRepository.getAIModels(dto);
  }
}

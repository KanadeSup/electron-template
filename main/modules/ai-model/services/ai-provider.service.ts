import { BadRequestError, NotFoundError } from "@main/modules/common/errors/common.error";
import { moveItemByDirection } from "@main/modules/common/utils/sort.util";
import type {
  AIProviderOutputDto,
  ChangeAIProviderPositionInputDto,
  GetAIProviderInputDto,
  GetAIProvidersOutputDto,
  UpdateAIProviderInputDto,
} from "../dto/ai-provider.dto";
import { AIProviderRepository } from "../repositories/ai-provider.repository";

export class AIProviderService {
  private readonly aiProviderRepository = new AIProviderRepository();

  getAIProviders(dto: GetAIProviderInputDto): GetAIProvidersOutputDto {
    return this.aiProviderRepository.getAIProviders(dto);
  }

  updateAIProvider(dto: UpdateAIProviderInputDto): AIProviderOutputDto {
    const provider = this.aiProviderRepository.updateAIProvider(dto);
    if (!provider) {
      throw new NotFoundError("AI provider not found");
    }
    return provider;
  }

  changeAIProviderPosition(dto: ChangeAIProviderPositionInputDto): void {
    const providers = this.aiProviderRepository.getAIProviders({});
    const currentOrderedProviders = providers.sort((a, b) => a.sortOrder - b.sortOrder);
    const movedIndex = currentOrderedProviders.findIndex((provider) => provider.id === dto.id);
    if (movedIndex === -1) {
      throw new NotFoundError("AI provider not found");
    }
    const result = moveItemByDirection(currentOrderedProviders, movedIndex, dto.direction);
    if (!result.success) {
      throw new BadRequestError(result.errorMessage);
    }
    const reordered = result.reordered;
    this.aiProviderRepository.updateAIProviderSortOrders(
      reordered.map((provider, index) => ({
        id: provider.id,
        sortOrder: index,
      })),
    );
  }
}

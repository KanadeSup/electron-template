import { BadRequestError, NotFoundError } from "@main/modules/common/errors/common.error";
import type { ChangePositionDirection } from "@shared/contracts/ai-model.contract";
import type {
  AIModelOutputDto,
  AIProviderOutputDto,
  ChangeAIModelPositionInputDto,
  ChangeAIProviderPositionInputDto,
  DeleteAIModelInputDto,
  GetAIModelsInputDto,
  GetAIModelsOutputDto,
  GetAIProviderInputDto,
  GetAIProvidersOutputDto,
  SortOrderItemDto,
  UpdateAIModelInputDto,
  UpdateAIProviderInputDto,
} from "../dto/ai-model.dto";
import { AIModelRepository } from "../repositories/ai-model.repository";
import { AIProviderRepository } from "../repositories/ai-provider.repository";

export class AIModelService {
  private readonly aiModelRepository = new AIModelRepository();
  private readonly aiProviderRepository = new AIProviderRepository();

  async getAIProviders(dto: GetAIProviderInputDto): Promise<GetAIProvidersOutputDto> {
    return this.aiProviderRepository.getAIProviders(dto);
  }

  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    return this.aiModelRepository.getAIModels(dto);
  }

  async updateAIProvider(dto: UpdateAIProviderInputDto): Promise<AIProviderOutputDto> {
    const provider = await this.aiProviderRepository.updateAIProvider(dto);
    if (!provider) {
      throw new NotFoundError("AI provider not found");
    }
    return provider;
  }

  async changeAIProviderPosition(dto: ChangeAIProviderPositionInputDto): Promise<void> {
    const providers = await this.aiProviderRepository.getAIProviders({});
    const currentOrderedProviders = providers.sort((a, b) => a.sortOrder - b.sortOrder);
    const reordered = this.moveItemByDirection(
      currentOrderedProviders,
      dto.id,
      dto.direction,
      "AI provider not found",
    );
    await this.aiProviderRepository.updateAIProviderSortOrders(this.toSortOrderItems(reordered));
  }

  async updateAIModel(dto: UpdateAIModelInputDto): Promise<AIModelOutputDto> {
    if (dto.modelId === undefined && dto.enabled === undefined) {
      throw new BadRequestError("No fields to update");
    }

    const modelId = dto.modelId !== undefined ? dto.modelId.trim() : undefined;
    if (modelId !== undefined && modelId.length === 0) {
      throw new BadRequestError("Model id must not be empty");
    }

    const model = await this.aiModelRepository.updateAIModel({
      id: dto.id,
      enabled: dto.enabled,
      modelId,
    });
    if (!model) {
      throw new NotFoundError("AI model not found");
    }
    return model;
  }

  async changeAIModelPosition(dto: ChangeAIModelPositionInputDto): Promise<void> {
    const model = await this.aiModelRepository.getAIModelById(dto.id);
    if (!model) {
      throw new NotFoundError("AI model not found");
    }

    const models = await this.aiModelRepository.getAIModels({ providerId: model.providerId });
    const currentOrderedModels = models.sort((a, b) => a.sortOrder - b.sortOrder);
    const reordered = this.moveItemByDirection(
      currentOrderedModels,
      dto.id,
      dto.direction,
      "AI model not found",
    );
    await this.aiModelRepository.updateAIModelSortOrders(this.toSortOrderItems(reordered));
  }

  async deleteAIModel(dto: DeleteAIModelInputDto): Promise<void> {
    const deleted = await this.aiModelRepository.deleteAIModel(dto.id);
    if (!deleted) {
      throw new NotFoundError("AI model not found");
    }
  }

  private moveItemByDirection<T extends { id: number }>(
    items: T[],
    id: number,
    direction: ChangePositionDirection,
    notFoundMessage: string,
  ): T[] {
    const currentIndex = items.findIndex((item) => item.id === id);
    if (currentIndex === -1) throw new NotFoundError(notFoundMessage);

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) {
      throw new BadRequestError("Cannot move item further in this direction");
    }

    const reordered = [...items];
    const movedItem = reordered.splice(currentIndex, 1)[0];
    if (!movedItem) throw new BadRequestError("Cannot move item further in this direction");

    reordered.splice(targetIndex, 0, movedItem);
    return reordered;
  }

  private toSortOrderItems(items: { id: number }[]): SortOrderItemDto[] {
    return items.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));
  }
}

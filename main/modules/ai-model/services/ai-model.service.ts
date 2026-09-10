import { BadRequestError, NotFoundError } from "@main/modules/common/errors/common.error";
import { moveItemByDirection } from "@main/modules/common/utils/sort.util";
import { LLMClientFactory } from "@main/modules/llm-client/factories/llm-client.factory";
import type {
  AIModelOutputDto,
  ChangeAIModelPositionInputDto,
  DeleteAIModelInputDto,
  FetchModelByProviderOutputDto,
  GetAIModelsInputDto,
  GetAIModelsOutputDto,
  UpdateAIModelInputDto,
} from "../dto/ai-model.dto";
import { AIModelRepository } from "../repositories/ai-model.repository";
import { AIProviderRepository } from "../repositories/ai-provider.repository";

export class AIModelService {
  private readonly aiModelRepository = new AIModelRepository();
  private readonly aiProviderRepository = new AIProviderRepository();

  getAIModels(dto: GetAIModelsInputDto): GetAIModelsOutputDto {
    return this.aiModelRepository.getAIModels(dto);
  }

  getAIModelByName(name: string): AIModelOutputDto | null {
    return this.aiModelRepository.getAIModelByName(name);
  }

  updateAIModel(dto: UpdateAIModelInputDto): AIModelOutputDto {
    if (dto.modelName === undefined && dto.enabled === undefined) {
      throw new BadRequestError("No fields to update");
    }

    const modelName = dto.modelName !== undefined ? dto.modelName.trim() : undefined;
    if (modelName !== undefined && modelName.length === 0) {
      throw new BadRequestError("Model name must not be empty");
    }

    const model = this.aiModelRepository.updateAIModel({
      id: dto.id,
      enabled: dto.enabled,
      modelName,
    });
    if (!model) throw new NotFoundError("AI model not found");
    return model;
  }

  changeAIModelPosition(dto: ChangeAIModelPositionInputDto): void {
    const model = this.aiModelRepository.getAIModelById(dto.id);
    if (!model) {
      throw new NotFoundError("AI model not found");
    }

    const models = this.aiModelRepository.getAIModels({ providerName: model.providerName });
    const currentOrderedModels = models.sort((a, b) => a.sortOrder - b.sortOrder);

    const movedIndex = currentOrderedModels.findIndex((m) => m.id === dto.id);
    if (movedIndex === -1) {
      throw new NotFoundError("AI model not found");
    }

    const result = moveItemByDirection(currentOrderedModels, movedIndex, dto.direction);
    if (!result.success) {
      throw new BadRequestError(result.errorMessage);
    }
    const reordered = result.reordered;
    this.aiModelRepository.updateAIModelSortOrders(
      reordered.map((model, index) => ({
        id: model.id,
        sortOrder: index,
      })),
    );
  }

  deleteAIModel(dto: DeleteAIModelInputDto): void {
    const deleted = this.aiModelRepository.deleteAIModel(dto.id);
    if (!deleted) {
      throw new NotFoundError("AI model not found");
    }
  }

  async fetchModelByProvider(providerId: number): Promise<FetchModelByProviderOutputDto> {
    const provider = this.aiProviderRepository.getAIProviderById(providerId);
    if (!provider) throw new NotFoundError("AI provider not found");

    const llmClientFactory = new LLMClientFactory();
    const llmClient = llmClientFactory.getClient(provider.providerName, {});

    const fetchedModels = await llmClient.getModelList();
    const currentModels = this.aiModelRepository.getAIModels({
      providerName: provider.providerName,
    });

    const modelsToCreate = fetchedModels
      .filter((model) => !currentModels.some((m) => m.modelName === model.modelName))
      .map((model) => model.modelName);
    const modelIdsToDelete = currentModels
      .filter((model) => !fetchedModels.some((m) => m.modelName === model.modelName))
      .map((model) => model.id);

    this.aiModelRepository.deleteAIModelsByIds(modelIdsToDelete);

    this.aiModelRepository.createAIModels(
      modelsToCreate.map((model) => ({
        modelName: model,
        providerId,
      })),
    );

    return this.aiModelRepository.getAIModels({ providerName: provider.providerName });
  }
}

import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import { z } from "zod";
import type {
  AIModelOutputDto,
  CreateAIModelInputDto,
  GetAIModelsInputDto,
  GetAIModelsOutputDto,
  SortOrderItemDto,
  UpdateAIModelInputDto,
} from "../dto/ai-model.dto";

const aiModelSchema = z.object({
  id: z.number(),
  modelId: z.string(),
  enabled: z.coerce.boolean(),
  providerId: z.string(),
  sortOrder: z.number(),
});

export class AIModelRepository {
  private readonly db = sqliteDatabase.getDb();

  getAIModels(dto: GetAIModelsInputDto): GetAIModelsOutputDto {
    const result = this.db
      .prepare(`
        SELECT m.id, m.model_id, m.enabled, m.sort_order, p.provider_id
        FROM ai_models m
        JOIN ai_providers p ON m.ai_provider_id = p.id
        WHERE
          1 = 1
          ${dto.providerId ? `AND provider_id = '${dto.providerId}'` : ""}
          ${dto.enabled !== undefined ? `AND enabled = ${dto.enabled}` : ""}
          ${dto.search ? `AND model_id LIKE '%${dto.search}%'` : ""}
      `)
      .all();

    return parseSchema(result, aiModelSchema.array());
  }

  getAIModelById(id: number): AIModelOutputDto | null {
    const result = this.db
      .prepare(`
        SELECT m.id, m.model_id, m.enabled, m.sort_order, p.provider_id
        FROM ai_models m
        JOIN ai_providers p ON m.ai_provider_id = p.id
        WHERE m.id = ${id}
      `)
      .get();

    if (result === undefined) return null;
    return parseSchema(result, aiModelSchema);
  }

  updateAIModel(dto: UpdateAIModelInputDto): AIModelOutputDto | null {
    if (dto.modelId === undefined && dto.enabled === undefined) {
      return null;
    }

    const result = this.db
      .prepare(`
        UPDATE ai_models
        SET 
          ${dto.modelId !== undefined ? `model_id = ${dto.modelId}` : ""} 
          ${dto.enabled !== undefined ? `enabled = ${dto.enabled}` : ""}
        WHERE id = ${dto.id}
      `)
      .run();

    if (result.changes === 0) return null;
    return this.getAIModelById(dto.id);
  }

  updateAIModelSortOrders(items: SortOrderItemDto[]): void {
    const statement = this.db.prepare(`
      UPDATE ai_models
      SET sort_order = ?
      WHERE id = ?
    `);

    const updateMany = this.db.transaction((rows: SortOrderItemDto[]) => {
      for (const row of rows) {
        statement.run(row.sortOrder, row.id);
      }
    });

    updateMany(items);
  }

  deleteAIModel(id: number): boolean {
    const result = this.db
      .prepare(`
        DELETE FROM ai_models
        WHERE id = ${id}
      `)
      .run();

    return result.changes > 0;
  }

  /**
   * Delete models by ids
   * return true if at least one model is deleted, otherwise false
   */
  deleteAIModelsByIds(ids: number[]): boolean {
    if (ids.length === 0) return false;

    const result = this.db
      .prepare(`
        DELETE FROM ai_models
        WHERE id IN (${ids.join(",")})
      `)
      .run();

    return result.changes > 0;
  }

  createAIModels(models: CreateAIModelInputDto[]): void {
    const schema = z.object({
      aiProviderId: z.number(),
      providerId: z.string(),
      sortOrder: z.number(),
    });

    const providerIds = models.map((model) => model.providerId);
    const result = this.db
      .prepare(`
        SELECT ai_provider_id, provider_id, MAX(model.sort_order) AS sort_order
        FROM ai_models model
        JOIN ai_providers provider ON model.ai_provider_id = provider.id
        WHERE provider.provider_id IN ( ${providerIds.map(() => "?").join(", ")} )
        GROUP BY provider.provider_id, model.ai_provider_id
      `)
      .all(providerIds);

    const parsedResult = parseSchema(result, schema.array());

    const sortOrderByProviderId = Object.fromEntries(
      parsedResult.map((item) => [item.providerId, item.sortOrder]),
    );
    const aiProviderIdByProviderId = Object.fromEntries(
      parsedResult.map((item) => [item.providerId, item.aiProviderId]),
    );

    this.db.transaction(() => {
      for (const model of models) {
        let sortOrder = 0;
        if (sortOrderByProviderId[model.providerId] != null) {
          sortOrder = sortOrderByProviderId[model.providerId] + 1;
        }
        const aiProviderId = aiProviderIdByProviderId[model.providerId];
        const result = this.db
          .prepare(`
            INSERT INTO ai_models (model_id, ai_provider_id, sort_order) 
            VALUES ('${model.modelId}', '${aiProviderId}', ${sortOrder})
            WHERE NOT EXISTS (
              SELECT 1 
              FROM ai_models 
              WHERE model_id = '${model.modelId}' AND ai_provider_id = '${aiProviderId}')
          `)
          .run();
        if (result.changes > 0) {
          sortOrderByProviderId[model.providerId] = sortOrder;
        }
      }
    });
  }
}

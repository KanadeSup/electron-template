import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import { z } from "zod";
import type {
  AIModelOutputDto,
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

  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    const result = this.db
      .prepare(`
        SELECT m.id, m.model_id, m.enabled, m.sort_order, p.provider_id
        FROM ai_models m
        JOIN ai_providers p ON m.ai_provider_id = p.id
        WHERE
          1 = 1
          ${dto.providerId ? `AND provider_id = ${dto.providerId}` : ""}
          ${dto.enabled !== undefined ? `AND enabled = ${dto.enabled}` : ""}
          ${dto.search ? `AND model_id LIKE '%${dto.search}%'` : ""}
      `)
      .all();

    return parseSchema(result, aiModelSchema.array());
  }

  async getAIModelById(id: number): Promise<AIModelOutputDto | null> {
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

  async updateAIModel(dto: UpdateAIModelInputDto): Promise<AIModelOutputDto | null> {
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

  async updateAIModelSortOrders(items: SortOrderItemDto[]): Promise<void> {
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

  async deleteAIModel(id: number): Promise<boolean> {
    const result = this.db
      .prepare(`
        DELETE FROM ai_models
        WHERE id = ${id}
      `)
      .run();

    return result.changes > 0;
  }
}

import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import z from "zod";
import type {
  AIProviderOutputDto,
  GetAIProviderInputDto,
  GetAIProvidersOutputDto,
  SortOrderItemDto,
  UpdateAIProviderInputDto,
} from "../dto/ai-model.dto";

const aiProviderSchema = z.object({
  id: z.number(),
  providerId: z.string(),
  providerName: z.string(),
  enabled: z.coerce.boolean(),
  apiKey: z.string(),
  sortOrder: z.number(),
});

export class AIProviderRepository {
  private readonly db = sqliteDatabase.getDb();

  getAIProviders(dto: GetAIProviderInputDto): GetAIProvidersOutputDto {
    const result = this.db
      .prepare(`
        SELECT id, provider_id, provider_name, enabled, api_key, sort_order
        FROM ai_providers
        WHERE 1 = 1
          ${dto.enabled !== undefined ? `AND enabled = ${dto.enabled}` : ""}
      `)
      .all();

    return parseSchema(result, aiProviderSchema.array());
  }

  getAIProviderById(id: number): AIProviderOutputDto | null {
    const result = this.db
      .prepare(`
        SELECT id, provider_id, provider_name, enabled, api_key, sort_order
        FROM ai_providers
        WHERE id = ?
      `)
      .get(id);

    if (result === undefined) return null;
    return parseSchema(result, aiProviderSchema);
  }

  getAIProviderByProviderId(providerId: string): AIProviderOutputDto | null {
    const result = this.db
      .prepare(`
        SELECT id, provider_id, provider_name, enabled, api_key, sort_order
        FROM ai_providers
        WHERE provider_id = ?
      `)
      .get(providerId);

    if (result === undefined) return null;
    return parseSchema(result, aiProviderSchema);
  }

  updateAIProvider(dto: UpdateAIProviderInputDto): AIProviderOutputDto | null {
    // If there is any field to update, return immediately
    if (dto.enabled === undefined && dto.apiKey === undefined) {
      return null;
    }

    const result = this.db
      .prepare(`
        UPDATE ai_providers
        SET 
          ${dto.enabled !== undefined ? `enabled = ${dto.enabled}` : ""} 
          ${dto.apiKey !== undefined ? `api_key = '${dto.apiKey.trim()}'` : ""}
        WHERE id = ${dto.id}
      `)
      .run();

    if (result.changes === 0) return null;
    return this.getAIProviderById(dto.id);
  }

  updateAIProviderSortOrders(items: SortOrderItemDto[]): void {
    const statement = this.db.prepare(`
      UPDATE ai_providers
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

  getAPIKeyByProviderId(providerId: string): string {
    const schema = z.object({
      apiKey: z.string(),
    });

    const result = this.db
      .prepare(`
        SELECT api_key
        FROM ai_providers
        WHERE provider_id = ?
      `)
      .get(providerId);

    return parseSchema(result, schema).apiKey;
  }
}

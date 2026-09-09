import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import z from "zod";
import type {
  AIProviderOutputDto,
  GetAIProviderInputDto,
  GetAIProvidersOutputDto,
  UpdateAIProviderInputDto,
} from "../dto/ai-provider.dto";
import type { SortOrderItemDto } from "../dto/sort.dto";

const aiProviderSchema = z.object({
  id: z.number(),
  providerLabel: z.string(),
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
        SELECT id, provider_label, provider_name, enabled, api_key, sort_order
        FROM providers
        WHERE 1 = 1
          ${dto.enabled !== undefined ? `AND enabled = ${dto.enabled}` : ""}
      `)
      .all();

    return parseSchema(result, aiProviderSchema.array());
  }

  getAIProviderById(id: number): AIProviderOutputDto | null {
    const result = this.db
      .prepare(`
        SELECT id, provider_label, provider_name, enabled, api_key, sort_order
        FROM providers
        WHERE id = ?
      `)
      .get(id);

    if (result === undefined) return null;
    return parseSchema(result, aiProviderSchema);
  }

  getAIProviderByName(providerName: string): AIProviderOutputDto | null {
    const result = this.db
      .prepare(`
        SELECT id, provider_label, provider_name, enabled, api_key, sort_order
        FROM providers
        WHERE provider_name = ?
      `)
      .get(providerName);

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
        UPDATE providers
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
      UPDATE providers
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

  getAPIKeyByProviderName(providerName: string): string {
    const schema = z.object({
      apiKey: z.string(),
    });

    const result = this.db
      .prepare(`
        SELECT api_key
        FROM providers
        WHERE provider_name = ?
      `)
      .get(providerName);

    return parseSchema(result, schema).apiKey;
  }
}

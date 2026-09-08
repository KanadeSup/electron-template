import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import { z } from "zod";
import type {
  AIProviderInputDto,
  AIProviderOutputDto,
  GetAIModelsInputDto,
  GetAIModelsOutputDto,
} from "../dto/ai-model.dto";

export class AIModelRepository {
  private readonly db = sqliteDatabase.getDb();

  async getAIProviders(dto: AIProviderInputDto): Promise<AIProviderOutputDto[]> {
    const schema = z.object({
      id: z.number(),
      providerId: z.string(),
      providerName: z.string(),
      enabled: z.coerce.boolean(),
      sortOrder: z.number(),
    });

    const result = this.db
      .prepare(`
        SELECT id, provider_id, provider_name, enabled, sort_order
        FROM ai_providers
        WHERE 1 = 1
          ${dto.enabled !== undefined ? `AND enabled = ${dto.enabled}` : ""}
      `)
      .all();

    return parseSchema(result, schema.array());
  }

  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    const schema = z.object({
      id: z.number(),
      modelId: z.string(),
      enabled: z.coerce.boolean(),
      providerId: z.string(),
      sortOrder: z.number(),
    });

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

    return parseSchema(result, schema.array());
  }
}

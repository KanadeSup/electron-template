import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import type { GetAIModelsInputDto, GetAIModelsOutputDto } from "../dto/ai-model.dto";

export class AIModelRepository {
  async getAIModels(dto: GetAIModelsInputDto): Promise<GetAIModelsOutputDto> {
    const result = sqliteDatabase
      .getDb()
      .prepare(`
        SELECT model_id, enabled FROM ai_models
        WHERE
          1 = 1
          ${dto.provider ? `AND provider = ${dto.provider}` : ""}
          ${dto.enabled ? `AND enabled = ${dto.enabled}` : ""}
          ${dto.search ? `AND model_id LIKE '%${dto.search}%'` : ""}
      `)
      .all() as { model_id: string; enabled: boolean }[];

    return result.map((row) => ({
      id: row.model_id,
      enabled: row.enabled,
    }));
  }
}

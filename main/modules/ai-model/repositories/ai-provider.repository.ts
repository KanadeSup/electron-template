import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import z from "zod";

export class AIProviderRepository {
  private readonly db = sqliteDatabase.getDb();

  getApiKeyByProviderId(providerId: string): string {
    const schema = z.object({
      apiKey: z.string(),
    });

    const result = this.db
      .prepare(`
        SELECT api_key
        FROM ai_providers
        WHERE provider_id = ${providerId}
      `)
      .get();

    return parseSchema(result, schema).apiKey;
  }
}

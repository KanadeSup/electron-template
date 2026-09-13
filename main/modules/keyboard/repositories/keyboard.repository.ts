import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import { z } from "zod";
import type {
  MappedKeyDto,
  ResetKeyInputDto,
  SetKeyInputDto,
  UnsetKeyInputDto,
} from "../dto/keyboard.dto";

export class KeyboardRepository {
  private readonly db = sqliteDatabase.getDb();

  getMappedKeys(): MappedKeyDto[] {
    const schema = z.object({
      key: z.string().nullable(),
      command: z.string(),
    });

    const result = this.db
      .prepare(`
        SELECT key, command
        FROM keyboard
      `)
      .all();

    return parseSchema(result, schema.array());
  }

  setKey(dto: SetKeyInputDto): void {
    const result = this.db
      .prepare(`
        UPDATE keyboard
        SET key = '${dto.key}'
        WHERE command = '${dto.command}'
      `)
      .run();

    if (result.changes > 0) return;

    this.db
      .prepare(`
        INSERT INTO keyboard (key, command)
        VALUES ('${dto.key}', '${dto.command}')
      `)
      .run();
  }

  unsetKey(dto: UnsetKeyInputDto): void {
    this.db
      .prepare(`
        UPDATE keyboard
        SET key = NULL
        WHERE command = '${dto.command}'
      `)
      .run();
  }

  resetKey(dto: ResetKeyInputDto): void {
    this.db
      .prepare(`
        DELETE FROM keyboard
        WHERE command = '${dto.command}'
      `)
      .run();
  }
}

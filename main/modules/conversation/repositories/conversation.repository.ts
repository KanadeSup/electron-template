import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import z from "zod";
import type {
  ConversationDto,
  ConversationListItemDto,
  CreateConversationInputDto,
  UpdateConversationInputDto,
} from "../dto/conversation.dto";

export class ConversationRepository {
  private readonly db = sqliteDatabase.getDb();

  getConversationList(): ConversationListItemDto[] {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      model: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    });

    const result = this.db
      .prepare(`
        SELECT id, name, model, created_at, updated_at
        FROM conversations
      `)
      .all();

    const parsedResult = parseSchema(result, schema.array());

    return parsedResult;
  }

  getConversationById(id: number): ConversationDto | null {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      model: z.string().nullable(),
      history: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    });

    const messagesSchema = z.object({
      id: z.number(),
      type: z.enum(["user", "assistant", "error", "think"]),
      content: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    });

    const conversationResult = this.db
      .prepare(`
        SELECT id, name, model, history, created_at, updated_at
        FROM conversations WHERE id = ?
      `)
      .get(id);

    if (conversationResult === undefined) {
      return null;
    }

    const messagesResult = this.db
      .prepare(`
        SELECT id, type, content, created_at, updated_at
        FROM conversation_messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
      `)
      .all(id);

    const conversation = parseSchema(conversationResult, schema);
    const messages = parseSchema(messagesResult, messagesSchema.array());

    return {
      ...conversation,
      messages,
    };
  }

  createConversation(dto: CreateConversationInputDto): number {
    const schema = z.object({
      id: z.number(),
    });
    const result = this.db
      .prepare(`
        INSERT INTO conversations (name, model, history)
        VALUES (?, ?, ?)
        RETURNING id
      `)
      .get(dto.name ?? "", dto.model ?? null, dto.history ?? null);

    const parsedResult = parseSchema(result, schema);

    return parsedResult.id;
  }

  updateConversation(id: number, conversation: UpdateConversationInputDto): boolean {
    const { name, model, history } = conversation;

    const updateFields = [];
    const updateValues = [];
    if (name !== undefined) {
      updateFields.push(`name = ?`);
      updateValues.push(name);
    }
    if (model !== undefined) {
      updateFields.push(`model = ?`);
      updateValues.push(model);
    }
    if (history !== undefined) {
      updateFields.push(`history = ?`);
      updateValues.push(history);
    }

    const result = this.db
      .prepare(`
        UPDATE conversations
        SET ${updateFields.join(", ")}
        WHERE id = ?
      `)
      .run(...updateValues, id);

    return result.changes > 0;
  }

  deleteConversationById(id: number): boolean {
    const result = this.db
      .prepare(`
      DELETE FROM conversations WHERE id = ?
    `)
      .run(id);
    if (result.changes === 0) {
      return false;
    }
    return true;
  }
}

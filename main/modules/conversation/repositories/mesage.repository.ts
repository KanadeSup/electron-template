import { sqliteDatabase } from "@main/modules/database/sqlite-database";
import { parseSchema } from "@main/modules/database/utils/sql-result.util";
import z from "zod";
import type {
  ConversationMessageDto,
  CreateMessageInputDto,
  UpdateMessageInputDto,
} from "../dto/message.dto";

const messageTypeSchema = z.enum(["user", "assistant", "think", "error"]);

const messagesSchema = z.object({
  id: z.number(),
  type: messageTypeSchema,
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export class MessageRepository {
  private readonly db = sqliteDatabase.getDb();

  getMessageListByConversationId(conversationId: number): ConversationMessageDto[] {
    const result = this.db
      .prepare(`
        SELECT id, type, content, created_at, updated_at
        FROM conversation_messages
        WHERE conversation_id = ${conversationId}
      `)
      .all();

    const parsedResult = parseSchema(result, messagesSchema.array());

    return parsedResult;
  }

  getMessageById(id: number): ConversationMessageDto | null {
    const result = this.db
      .prepare(`
        SELECT id, type, content, created_at, updated_at
        FROM conversation_messages WHERE id = ${id}
      `)
      .get();

    if (result === undefined) return null;

    return parseSchema(result, messagesSchema);
  }

  createMessage(message: CreateMessageInputDto): number {
    const schema = z.object({
      id: z.number(),
    });
    const result = this.db
      .prepare(`
        INSERT INTO conversation_messages (conversation_id, type, content)
        VALUES (${message.conversationId}, '${message.type}', '${message.content}')
        RETURNING id
      `)
      .get();

    const parsedResult = parseSchema(result, schema);

    return parsedResult.id;
  }

  updateMessage(id: number, message: UpdateMessageInputDto): boolean {
    const { content } = message;
    if (content === undefined) {
      return false;
    }

    const result = this.db
      .prepare(`
        UPDATE conversation_messages 
        SET content = '${content}' 
        WHERE id = ${id}
      `)
      .run();

    return result.changes > 0;
  }

  deleteMessageById(id: number): boolean {
    const result = this.db
      .prepare(`
        DELETE FROM conversation_messages WHERE id = ${id}
      `)
      .run();

    return result.changes > 0;
  }
}

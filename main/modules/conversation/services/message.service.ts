import type {
  ConversationMessageDto,
  CreateMessageInputDto,
  UpdateMessageInputDto,
} from "../dto/message.dto";
import { MessageRepository } from "../repositories/mesage.repository";

export class MessageService {
  private readonly messageRepository = new MessageRepository();

  getMessageListByConversationId(conversationId: number): ConversationMessageDto[] {
    return this.messageRepository.getMessageListByConversationId(conversationId);
  }

  getMessageById(messageId: number): ConversationMessageDto | null {
    return this.messageRepository.getMessageById(messageId);
  }

  createMessage(dto: CreateMessageInputDto): number {
    return this.messageRepository.createMessage(dto);
  }

  updateMessage(messageId: number, dto: UpdateMessageInputDto): boolean {
    return this.messageRepository.updateMessage(messageId, dto);
  }

  deleteMessage(messageId: number): boolean {
    return this.messageRepository.deleteMessageById(messageId);
  }
}

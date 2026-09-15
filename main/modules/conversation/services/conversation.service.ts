import type {
  ConversationDto,
  ConversationListItemDto,
  CreateConversationInputDto,
  DeleteConversationInputDto,
  UpdateConversationInputDto,
} from "../dto/conversation.dto";
import { ConversationRepository } from "../repositories/conversation.repository";

export class ConversationService {
  private readonly conversationRepository = new ConversationRepository();

  getConversationList(): ConversationListItemDto[] {
    const conversations = this.conversationRepository.getConversationList();
    return conversations;
  }

  getConversationById(conversationId: number): ConversationDto | null {
    const conversation = this.conversationRepository.getConversationById(conversationId);
    return conversation;
  }

  createConversation(dto: CreateConversationInputDto): number {
    const conversationId = this.conversationRepository.createConversation(dto);
    return conversationId;
  }

  updateConversation(conversationId: number, dto: UpdateConversationInputDto): boolean {
    return this.conversationRepository.updateConversation(conversationId, dto);
  }

  deleteConversation(dto: DeleteConversationInputDto): boolean {
    const deleted = this.conversationRepository.deleteConversationById(dto.conversationId);
    if (!deleted) return false;
    return true;
  }
}

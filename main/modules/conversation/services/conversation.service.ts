import type {
  ConversationDto,
  ConversationListItemDto,
  DeleteConversationInputDto,
  GetConversationByIdInputDto,
} from "../dto/conversation.dto";
import { ConversationRepository } from "../repositories/conversation.repository";

export class ConversationService {
  private readonly conversationRepository = new ConversationRepository();

  getConversationList(): ConversationListItemDto[] {
    const conversations = this.conversationRepository.getConversationList();
    return conversations;
  }

  getConversationById(dto: GetConversationByIdInputDto): ConversationDto | null {
    const conversation = this.conversationRepository.getConversationById(dto.conversationId);
    return conversation;
  }

  createConversation(): number {
    const conversationId = this.conversationRepository.createConversation({
      name: "",
    });
    return conversationId;
  }

  deleteConversation(dto: DeleteConversationInputDto): boolean {
    const deleted = this.conversationRepository.deleteConversationById(dto.conversationId);
    if (!deleted) return false;
    return true;
  }
}

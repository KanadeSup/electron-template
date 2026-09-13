import type {
  MappedKeyDto,
  ResetKeyInputDto,
  SetKeyInputDto,
  UnsetKeyInputDto,
} from "../dto/keyboard.dto";
import { KeyboardRepository } from "../repositories/keyboard.repository";

export class KeyboardService {
  private readonly keyboardRepository = new KeyboardRepository();

  getMappedKeys(): MappedKeyDto[] {
    return this.keyboardRepository.getMappedKeys();
  }

  setKey(dto: SetKeyInputDto): void {
    this.keyboardRepository.setKey(dto);
  }

  unsetKey(dto: UnsetKeyInputDto): void {
    this.keyboardRepository.unsetKey(dto);
  }

  resetKey(dto: ResetKeyInputDto): void {
    this.keyboardRepository.resetKey(dto);
  }
}

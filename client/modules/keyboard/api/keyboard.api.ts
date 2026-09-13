import { invoke } from "@client/modules/design-system/api/ipc-base";
import {
  GET_MAPPED_KEYS_CHANNEL_NAME,
  type GetMappedKeysRequest,
  type GetMappedKeysResponse,
  RESET_KEY_CHANNEL_NAME,
  type ResetKeyRequest,
  type ResetKeyResponse,
  SET_KEY_CHANNEL_NAME,
  type SetKeyRequest,
  type SetKeyResponse,
  UNSET_KEY_CHANNEL_NAME,
  type UnsetKeyRequest,
  type UnsetKeyResponse,
} from "@shared/contracts/keyboard.contract";

export async function getMappedKeys() {
  return invoke<GetMappedKeysRequest, GetMappedKeysResponse>(GET_MAPPED_KEYS_CHANNEL_NAME, null);
}

export async function setKey(key: string, command: string) {
  return invoke<SetKeyRequest, SetKeyResponse>(SET_KEY_CHANNEL_NAME, { key, command });
}

export async function unsetKey(command: string) {
  return invoke<UnsetKeyRequest, UnsetKeyResponse>(UNSET_KEY_CHANNEL_NAME, { command });
}

export async function resetKey(command: string) {
  return invoke<ResetKeyRequest, ResetKeyResponse>(RESET_KEY_CHANNEL_NAME, { command });
}

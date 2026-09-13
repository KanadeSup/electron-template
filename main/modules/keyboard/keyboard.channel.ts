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
import { createChannel } from "../common/ipc-channel/base-channel";
import { KeyboardService } from "./services/keyboard.service";

export const getMappedKeysChannel = createChannel<GetMappedKeysRequest, GetMappedKeysResponse>({
  name: GET_MAPPED_KEYS_CHANNEL_NAME,
  handle: async () => {
    const keyboardService = new KeyboardService();
    return keyboardService.getMappedKeys();
  },
});

export const setKeyChannel = createChannel<SetKeyRequest, SetKeyResponse>({
  name: SET_KEY_CHANNEL_NAME,
  handle: async (request) => {
    const keyboardService = new KeyboardService();
    keyboardService.setKey(request);
    return null;
  },
});

export const unsetKeyChannel = createChannel<UnsetKeyRequest, UnsetKeyResponse>({
  name: UNSET_KEY_CHANNEL_NAME,
  handle: async (request) => {
    const keyboardService = new KeyboardService();
    keyboardService.unsetKey(request);
    return null;
  },
});

export const resetKeyChannel = createChannel<ResetKeyRequest, ResetKeyResponse>({
  name: RESET_KEY_CHANNEL_NAME,
  handle: async (request) => {
    const keyboardService = new KeyboardService();
    keyboardService.resetKey(request);
    return null;
  },
});

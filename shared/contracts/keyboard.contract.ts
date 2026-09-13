export type MappedKey = {
  key: string | null;
  command: string;
};

// ========== Get mapped keys ==============
export const GET_MAPPED_KEYS_CHANNEL_NAME = "get-mapped-keys" as const;

export type GetMappedKeysRequest = null;

export type GetMappedKeysResponse = MappedKey[];

// ========== Set key ==============
export const SET_KEY_CHANNEL_NAME = "set-key" as const;

export type SetKeyRequest = {
  key: string;
  command: string;
};

export type SetKeyResponse = null;

// ========== Unset key ==============
export const UNSET_KEY_CHANNEL_NAME = "unset-key" as const;

export type UnsetKeyRequest = {
  command: string;
};

export type UnsetKeyResponse = null;

// ========== Reset key ==============
export const RESET_KEY_CHANNEL_NAME = "reset-key" as const;

export type ResetKeyRequest = {
  command: string;
};

export type ResetKeyResponse = null;

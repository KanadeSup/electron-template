export type MappedKeyDto = {
  key: string | null;
  command: string;
};

export type SetKeyInputDto = {
  key: string;
  command: string;
};

export type UnsetKeyInputDto = {
  command: string;
};

export type ResetKeyInputDto = {
  command: string;
};

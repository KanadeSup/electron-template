import type { StorageData, StorageDefinition } from "../store.schema";

type CollectionStorageFallback = {
  // biome-ignore lint/suspicious/noExplicitAny: The any type does not matter here
  records: any[];
};

// Collection storage keys (automatically inferred from storage definition)
export type CollectionStorageKeys = {
  [K in keyof StorageDefinition]: StorageDefinition[K]["type"] extends "collection" ? K : never;
}[keyof StorageDefinition];

export type CollectionStorage<T extends CollectionStorageKeys> = [CollectionStorageKeys] extends [
  never,
]
  ? CollectionStorageFallback
  : StorageData<T>;

export type CollectionRecords<T extends CollectionStorageKeys> = CollectionStorage<T>["records"];

export type CollectionRecord<T extends CollectionStorageKeys> = CollectionRecords<T>[number];

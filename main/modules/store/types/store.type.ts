import type { StoreData, StoreDefinition } from "../store.schema";

type CollectionStoreFallback = {
  // biome-ignore lint/suspicious/noExplicitAny: The any type does not matter here
  records: any[];
};

// Collection store keys (automatically inferred from store definition)
export type CollectionStoreKeys = {
  [K in keyof StoreDefinition]: StoreDefinition[K]["type"] extends "collection" ? K : never;
}[keyof StoreDefinition];

export type CollectionStore<T extends CollectionStoreKeys> = [CollectionStoreKeys] extends [never]
  ? CollectionStoreFallback
  : StoreData<T>;

export type CollectionRecords<T extends CollectionStoreKeys> = CollectionStore<T>["records"];

export type CollectionRecord<T extends CollectionStoreKeys> = CollectionRecords<T>[number];

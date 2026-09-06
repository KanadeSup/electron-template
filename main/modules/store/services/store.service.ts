import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FileSystemService } from "@main/modules/filesystem/services/filesystem.service";
import { type StoreData, type StoreDefinition, storeDefinition } from "../store.schema";
import type {
  CollectionRecord,
  CollectionRecords,
  CollectionStore,
  CollectionStoreKeys,
} from "../types/store.type";

export class FileStoreService {
  private readonly fileSystemService: FileSystemService;

  constructor() {
    this.fileSystemService = new FileSystemService();
  }

  /** Get the path to the store directory */
  getOrCreateStoreDirPath() {
    const storePath = join(this.fileSystemService.getOrCreateDataDirPath(), "store");
    if (!existsSync(storePath)) {
      mkdirSync(storePath, { recursive: true });
    }
    return storePath;
  }

  /** Get the path to the store file
   * If the file does not exist and the store is a key-value store,
   * create the file with the default data
   */
  getOrCreateStoreFilePath(name: keyof StoreDefinition) {
    const filePath = join(this.getOrCreateStoreDirPath(), `${name}.json`);

    if (!existsSync(filePath) && storeDefinition[name].type === "key-value") {
      const defaultData = storeDefinition[name].defaultData;
      writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    return filePath;
  }

  /** Get the store data */
  getStoreData<T extends keyof StoreDefinition>(name: T): StoreData<T> {
    const filePath = this.getOrCreateStoreFilePath(name);
    const rawData = JSON.parse(readFileSync(filePath, "utf8"));
    const data = storeDefinition[name].schema.partial().parse(rawData);

    if (storeDefinition[name].type === "key-value") {
      const defaultData = storeDefinition[name].defaultData;
      return {
        ...defaultData,
        ...data,
      } as StoreData<T>;
    }
    return data as StoreData<T>;
  }

  /** Update the store data.
   * If the value is undefined, it will be ignored.
   */
  updateStoreData<T extends keyof StoreDefinition>(name: T, data: Partial<StoreData<T>>) {
    const storeData = this.getStoreData(name);

    // Remove undefined values from the data
    const resolvedUpdatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    const mergedData = {
      ...storeData,
      ...resolvedUpdatedData,
    };

    const filePath = this.getOrCreateStoreFilePath(name);
    writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
  }

  createCollectionRecord<T extends CollectionStoreKeys>(name: T, record: CollectionRecord<T>) {
    const storeData = this.getCollectionStore(name);
    const newRecords = [...storeData.records, record] as CollectionRecords<T>;
    this.setCollectionRecords(name, newRecords);
  }

  setCollectionRecords<T extends CollectionStoreKeys>(name: T, records: CollectionRecords<T>) {
    const filePath = this.getOrCreateStoreFilePath(name);
    const { schema } = storeDefinition[name];
    // biome-ignore lint/suspicious/noExplicitAny: any type is used to prevent lint error when name T is never
    const typeSafeSchema = schema as [typeof schema] extends [never] ? any : typeof schema;
    const data = typeSafeSchema.parse({
      records,
    });
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  findCollectionRecord<T extends CollectionStoreKeys>(
    name: T,
    id: string,
  ): CollectionRecord<T> | null {
    const storeData = this.getCollectionStore(name);
    return storeData.records.find((record) => "id" in record && record.id === id) ?? null;
  }

  private getCollectionStore<T extends CollectionStoreKeys>(name: T): CollectionStore<T> {
    return this.getStoreData(name as keyof StoreDefinition) as unknown as CollectionStore<T>;
  }
}

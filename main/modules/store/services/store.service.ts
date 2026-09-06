import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FileSystemService } from "@main/modules/filesystem/services/filesystem.service";
import { type StorageData, type StorageDefinition, storageDefinition } from "../store.schema";
import type {
  CollectionRecord,
  CollectionRecords,
  CollectionStorage,
  CollectionStorageKeys,
} from "../types/store.type";

export class FileStorageService {
  private readonly fileSystemService: FileSystemService;

  constructor() {
    this.fileSystemService = new FileSystemService();
  }

  /** Get the path to the storage directory */
  getOrCreateStorageDirPath() {
    const storagePath = join(this.fileSystemService.getOrCreateDataDirPath(), "storage");
    if (!existsSync(storagePath)) {
      mkdirSync(storagePath, { recursive: true });
    }
    return storagePath;
  }

  /** Get the path to the storage file
   * If the file does not exist and the storage is a key-value storage,
   * create the file with the default data
   */
  getOrCreateStorageFilePath(name: keyof StorageDefinition) {
    const filePath = join(this.getOrCreateStorageDirPath(), `${name}.json`);

    if (!existsSync(filePath) && storageDefinition[name].type === "key-value") {
      const defaultData = storageDefinition[name].defaultData;
      writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    return filePath;
  }

  /** Get the storage data */
  getStorageData<T extends keyof StorageDefinition>(name: T): StorageData<T> {
    const filePath = this.getOrCreateStorageFilePath(name);
    const rawData = JSON.parse(readFileSync(filePath, "utf8"));
    const data = storageDefinition[name].schema.partial().parse(rawData);

    if (storageDefinition[name].type === "key-value") {
      const defaultData = storageDefinition[name].defaultData;
      return {
        ...defaultData,
        ...data,
      } as StorageData<T>;
    }
    return data as StorageData<T>;
  }

  /** Update the storage data.
   * If the value is undefined, it will be ignored.
   */
  updateStorageData<T extends keyof StorageDefinition>(name: T, data: Partial<StorageData<T>>) {
    const storageData = this.getStorageData(name);

    // Remove undefined values from the data
    const resolvedUpdatedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    const mergedData = {
      ...storageData,
      ...resolvedUpdatedData,
    };

    const filePath = this.getOrCreateStorageFilePath(name);
    writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
  }

  createCollectionRecord<T extends CollectionStorageKeys>(name: T, record: CollectionRecord<T>) {
    const storageData = this.getCollectionStorage(name);
    const newRecords = [...storageData.records, record] as CollectionRecords<T>;
    this.setCollectionRecords(name, newRecords);
  }

  setCollectionRecords<T extends CollectionStorageKeys>(name: T, records: CollectionRecords<T>) {
    const filePath = this.getOrCreateStorageFilePath(name);
    const { schema } = storageDefinition[name];
    // biome-ignore lint/suspicious/noExplicitAny: any type is used to prevent lint error when name T is never
    const typeSafeSchema = schema as [typeof schema] extends [never] ? any : typeof schema;
    const data = typeSafeSchema.parse({
      records,
    });
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  findCollectionRecord<T extends CollectionStorageKeys>(
    name: T,
    id: string,
  ): CollectionRecord<T> | null {
    const storageData = this.getCollectionStorage(name);
    return storageData.records.find((record) => "id" in record && record.id === id) ?? null;
  }

  private getCollectionStorage<T extends CollectionStorageKeys>(name: T): CollectionStorage<T> {
    return this.getStorageData(name as keyof StorageDefinition) as unknown as CollectionStorage<T>;
  }
}

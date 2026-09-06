import z from "zod";

export const storageDefinition = {
  configuration: defineKeyValueStorage({
    schema: z.object({ userStoragePath: z.string().nullable() }),
    defaultData: {
      userStoragePath: null,
    },
  }),
};

export type StorageDefinition = typeof storageDefinition;
export type StorageData<T extends keyof StorageDefinition> = z.infer<
  StorageDefinition[T]["schema"]
>;

type CollectionSchema = z.ZodObject<{
  records: z.ZodArray<z.ZodType>;
}>;

export function defineCollectionStorage<TSchema extends CollectionSchema>(config: {
  schema: TSchema;
}) {
  return {
    type: "collection" as const,
    schema: config.schema,
  };
}

function defineKeyValueStorage<TSchema extends z.ZodType>(config: {
  schema: TSchema;
  defaultData: z.infer<TSchema>;
}) {
  return {
    type: "key-value" as const,
    schema: config.schema,
    defaultData: config.defaultData,
  };
}

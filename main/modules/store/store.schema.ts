import z from "zod";

export const storeDefinition = {
  configuration: defineKeyValueStore({
    schema: z.object({ userStoragePath: z.string().nullable() }),
    defaultData: {
      userStoragePath: null,
    },
  }),
};

export type StoreDefinition = typeof storeDefinition;
export type StoreData<T extends keyof StoreDefinition> = z.infer<StoreDefinition[T]["schema"]>;

type CollectionSchema = z.ZodObject<{
  records: z.ZodArray<z.ZodType>;
}>;

export function defineCollectionStore<TSchema extends CollectionSchema>(config: {
  schema: TSchema;
}) {
  return {
    type: "collection" as const,
    schema: config.schema,
  };
}

function defineKeyValueStore<TSchema extends z.ZodType>(config: {
  schema: TSchema;
  defaultData: z.infer<TSchema>;
}) {
  return {
    type: "key-value" as const,
    schema: config.schema,
    defaultData: config.defaultData,
  };
}

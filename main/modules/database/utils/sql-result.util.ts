import type z from "zod";

type UnknownRecord = Record<string, unknown>;

function camelCaseKey(key: string): string {
  return key.replace(/[-_]+([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function toCamelCase<T>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map(toCamelCase) as T;
  }
  if (value === null || typeof value !== "object") {
    return value as T;
  }
  const result: UnknownRecord = {};
  for (const [key, objectValue] of Object.entries(value)) {
    result[camelCaseKey(key)] = objectValue;
  }
  return result as T;
}

export function parseSchema<T extends z.ZodType>(value: unknown, schema: T): z.output<T> {
  return schema.parse(toCamelCase(value));
}

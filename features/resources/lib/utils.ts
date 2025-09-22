import { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

const JSON_DATA_TYPES = ["jsonb", "json"] as const;

export function getJsonColumns(
  columnsSchema: ColumnSchema[],
): ColumnSchema[] {
  return columnsSchema.filter((column) =>
    JSON_DATA_TYPES.includes(
      column.data_type as (typeof JSON_DATA_TYPES)[number],
    ),
  );
}

export function serializeData(
  input: ResourceDataSchema | null,
  columnsSchema: ColumnSchema[],
): ResourceDataSchema | null {
  if (!input) return input;

  const jsonColumns = getJsonColumns(columnsSchema);

  const serialized = jsonColumns.reduce((acc, column) => {
    acc[column.name as keyof ResourceDataSchema] = JSON.stringify(
      input[column.name as keyof ResourceDataSchema],
    );
    return acc;
  }, {} as ResourceDataSchema);

  const otherValues = columnsSchema.reduce((acc, column) => {
    if (column.data_type === "ARRAY") {
      acc[column.name as keyof ResourceDataSchema] =
        input[column.name as keyof ResourceDataSchema];
    } else {
      acc[column.name as keyof ResourceDataSchema] =
        input[column.name as keyof ResourceDataSchema]?.toString();
    }
    return acc;
  }, {} as ResourceDataSchema);

  return { ...otherValues, ...serialized };
}

export function parseJsonColumns(
  input: ResourceDataSchema,
  jsonColumns: ColumnSchema[],
): ResourceDataSchema {
  return jsonColumns.reduce((acc, column) => {
    try {
      acc[column.name as keyof ResourceDataSchema] = JSON.parse(
        input[column.name as keyof ResourceDataSchema] as string,
      );
    } catch {
      acc[column.name as keyof ResourceDataSchema] =
        input[column.name as keyof ResourceDataSchema];
    }
    return acc;
  }, {} as ResourceDataSchema);
}

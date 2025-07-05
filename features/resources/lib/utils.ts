import { TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

const JSON_DATA_TYPES = ["jsonb", "json"] as const;

export function getJsonColumns(
  columnsSchema: Tables<"_pg_meta_columns">[],
): Tables<"_pg_meta_columns">[] {
  return columnsSchema.filter((column) =>
    JSON_DATA_TYPES.includes(
      column.data_type as (typeof JSON_DATA_TYPES)[number],
    ),
  );
}

export function serializeData(
  input: TableSchema | null,
  columnsSchema: Tables<"_pg_meta_columns">[],
): TableSchema | null {
  if (!input) return input;

  const jsonColumns = getJsonColumns(columnsSchema);

  const serialized = jsonColumns.reduce((acc, column) => {
    acc[column.name as keyof TableSchema] = JSON.stringify(
      input[column.name as keyof TableSchema],
    );
    return acc;
  }, {} as TableSchema);

  const otherValues = columnsSchema.reduce((acc, column) => {
    if (column.data_type === "ARRAY") {
      acc[column.name as keyof TableSchema] =
        input[column.name as keyof TableSchema];
    } else {
      acc[column.name as keyof TableSchema] =
        input[column.name as keyof TableSchema]?.toString();
    }
    return acc;
  }, {} as TableSchema);

  return { ...otherValues, ...serialized };
}

export function parseJsonColumns(
  input: TableSchema,
  jsonColumns: Tables<"_pg_meta_columns">[],
): TableSchema {
  return jsonColumns.reduce((acc, column) => {
    try {
      acc[column.name as keyof TableSchema] = JSON.parse(
        input[column.name as keyof TableSchema] as string,
      );
    } catch {
      acc[column.name as keyof TableSchema] =
        input[column.name as keyof TableSchema];
    }
    return acc;
  }, {} as TableSchema);
}

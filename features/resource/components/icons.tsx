import { ColumnSchema, TableSchema } from "@/lib/database-meta.types";

import { getColumnMetadata } from "../lib/columns";

export function getDataTypeIcon(
  tableSchema: TableSchema | null,
  columnSchema: ColumnSchema,
) {
  const { icon } = getColumnMetadata(tableSchema, columnSchema);
  return icon;
}

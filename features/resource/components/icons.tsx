import { ColumnSchema } from "@/lib/database-meta.types";
import { getColumnMetadata } from "../lib/columns";

export function getDataTypeIcon(columnSchema: ColumnSchema) {
  const { icon } = getColumnMetadata(columnSchema);
  return icon;
}

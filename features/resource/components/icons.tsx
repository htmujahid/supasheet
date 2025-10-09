import { ColumnSchema } from "@/lib/database-meta.types";
import { getColumnData } from "../lib/columns";

export function getDataTypeIcon(columnSchema: ColumnSchema) {
  const { icon } = getColumnData(columnSchema);
  return icon;
}

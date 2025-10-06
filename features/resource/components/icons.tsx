import { ColumnSchema } from "@/lib/database-meta.types";
import { getColumnData } from "../lib/columns";

export function getDataTypeIcon(columnSchema: ColumnSchema) {
  const { icon, isArray } = getColumnData(columnSchema);

  if (icon) {
    return (
      <code className="text-muted-foreground font-mono text-xs">{icon}{isArray && "[]"}</code>
    );
  }
}

import { ColumnDef } from "@tanstack/react-table";

import { getColumnMetadata } from "@/features/resource/lib/columns";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

export function getResourceGridColumns({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: ColumnSchema[];
  tableSchema: TableSchema | null;
}) {
  return (columnsSchema ?? []).map((c) => ({
    id: c.name,
    accessorKey: c.name as string,
    header: formatTitle(c.name ?? ""),
    size: 170,
    enableColumnFilter: true,
    meta: {
      ...getColumnMetadata(tableSchema, c),
    },
    enableSorting: true,
    enableHiding: true,
  })) as ColumnDef<ResourceDataSchema, unknown>[];
}

import { ColumnDef } from "@tanstack/react-table";
import { Link2Icon } from "lucide-react";

import { getColumnMetadata } from "@/features/resource/lib/columns";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableMetadata,
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
  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;

  const joinedColumns: `${string}.${string}`[] = (
    tableMeta.query?.join ?? []
  ).flatMap((join) =>
    join.columns.map((col) => `${join.table}.${col}` as const),
  );

  return [
    ...joinedColumns.map((col) => ({
      id: col.replace(".", "_"),
      accessorKey: col,
      header: formatTitle(col.replace(".", "_")),
      meta: {
        label: formatTitle(col.replace(".", "_")),
        icon: <Link2Icon className="text-muted-foreground size-4 shrink-0" />,
        disabled: true,
      },
      enableColumnFilter: true,
      size: 200,
      enableSorting: true,
      enableHiding: true,
    })),
    ...(columnsSchema ?? []).map((c) => ({
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
    })),
  ] as ColumnDef<ResourceDataSchema, unknown>[];
}

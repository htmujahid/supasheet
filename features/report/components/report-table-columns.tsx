import { Column, ColumnDef, Row } from "@tanstack/react-table";

import { ResourceColumnHeader } from "@/features/resource/components/resource-column-header";
import { ResourceRowCell } from "@/features/resource/components/resource-row-cell";
import { getColumnMeta } from "@/features/resource/lib/columns";
import { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

export function getReportTableColumns({
  columnsSchema,
}: {
  columnsSchema: ColumnSchema[];
}) {
  return [
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: ({ column }: { column: Column<ResourceDataSchema, unknown> }) => (
        <ResourceColumnHeader
          column={column}
          columnSchema={c}
          tableSchema={null}
          title={c.name as string}
        />
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          column={c}
          tableSchema={null}
          setRowAction={() => {}}
        />
      ),
      size: 170,
      enableColumnFilter: true,
      meta: getColumnMeta(c),
      enableSorting: true,
      enableHiding: true,
    })),
  ] as ColumnDef<ResourceDataSchema, unknown>[];
}

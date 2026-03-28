import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { getColumnMetadata } from "#/lib/columns"
import type { ColumnSchema } from "#/lib/database-meta.types"

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function getReportTableColumns(columnsSchema: ColumnSchema[]) {
  return columnsSchema.map((col) => ({
    id: col.name ?? col.id,
    accessorKey: col.name as string,
    header: ({
      column,
    }: {
      column: Column<Record<string, unknown>, unknown>
    }) => <DataTableColumnHeader column={column} title={col.name ?? col.id} />,
    cell: ({ row }: { row: Row<Record<string, unknown>> }) => {
      const value = row.getValue(col.name as string)
      return (
        <span className="text-sm text-muted-foreground">
          {formatCellValue(value)}
        </span>
      )
    },
    size: 170,
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
    meta: getColumnMetadata(null, col),
  })) as ColumnDef<Record<string, unknown>, unknown>[]
}

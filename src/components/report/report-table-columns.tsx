import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import type { Database } from "#/lib/database.types"
import type { FilterVariant } from "#/types/data-table"

type ColumnSchema = Database["supasheet"]["Tables"]["columns"]["Row"]

function getFilterVariant(column: ColumnSchema): FilterVariant {
  const format = column.format ?? ""
  const dataType = column.data_type ?? ""

  if (format === "bool" || dataType === "boolean") return "boolean"
  if (["int2", "int4", "int8", "float4", "float8", "numeric"].includes(format))
    return "number"
  if (format === "date" || dataType === "date") return "date"
  if (format === "time" || dataType === "time without time zone") return "time"
  if (format === "timetz" || dataType === "time with time zone") return "timetz"
  if (format === "timestamp" || dataType === "timestamp without time zone")
    return "timestamp"
  if (format === "timestamptz" || dataType === "timestamp with time zone")
    return "timestamptz"

  return "text"
}

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
    meta: {
      label: col.name ?? col.id,
      variant: getFilterVariant(col),
    },
  })) as ColumnDef<Record<string, unknown>, unknown>[]
}

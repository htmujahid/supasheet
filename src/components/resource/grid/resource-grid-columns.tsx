import type { Column, ColumnDef } from "@tanstack/react-table"

import { getColumnMetadata } from "#/lib/columns"
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"

import { ResourceGridColumnHeader } from "./resource-grid-column-header"

export function getResourceGridColumns({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema | null
}) {
  const cols: ColumnDef<Record<string, unknown>, unknown>[] = []

  for (const col of columnsSchema) {
    const name = col.name ?? col.id

    cols.push({
      id: name,
      accessorKey: name,
      header: ({
        column,
      }: {
        column: Column<Record<string, unknown>, unknown>
      }) => (
        <ResourceGridColumnHeader
          column={column}
          title={name}
          tableSchema={tableSchema}
          columnSchema={col}
          isSorted={column.getIsSorted()}
        />
      ),
      size: 170,
      enableSorting: true,
      enableHiding: true,
      enableColumnFilter: true,
      meta: getColumnMetadata(tableSchema, col),
    })
  }

  return cols
}

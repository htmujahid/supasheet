import type { Column, ColumnDef } from "@tanstack/react-table"

import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"

import { ResourceGridColumnHeader } from "./resource-grid-column-header"

export function parsePkSplat(
  splat: string,
  primaryKeys: PrimaryKey[]
): Record<string, unknown> {
  const values = splat.split("/").map(decodeURIComponent)
  return Object.fromEntries(primaryKeys.map((pk, i) => [pk.name, values[i]]))
}

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

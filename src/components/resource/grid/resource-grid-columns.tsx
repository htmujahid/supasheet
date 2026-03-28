import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "#/lib/database-meta.types"

import { ResourceGridColumnHeader } from "./resource-grid-column-header"
import { ResourceGridRowCell } from "./resource-grid-row-cell"

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
          pinnedState={column.getIsPinned()}
        />
      ),
      cell: ({
        row,
        column,
      }: {
        row: Row<ResourceDataSchema>
        column: Column<ResourceDataSchema, unknown>
      }) => (
        <ResourceGridRowCell
          row={row}
          column={column}
          columnSchema={col}
          tableSchema={tableSchema ?? null}
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

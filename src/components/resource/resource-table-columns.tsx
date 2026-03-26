import { Link } from "@tanstack/react-router"

import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { ArrowUpRightIcon, Link2Icon } from "lucide-react"

import { Checkbox } from "#/components/ui/checkbox"
import { getColumnFilterData } from "#/lib/columns"
import type {
  ColumnSchema,
  PrimaryKey,
  ResourceDataSchema,
  TableMetadata,
  TableSchema,
} from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"

import { ResourceColumnHeader } from "./resource-column-header"
import { ResourceRowCell } from "./resource-row-cell"

export function parsePkSplat(
  splat: string,
  primaryKeys: PrimaryKey[]
): Record<string, unknown> {
  const values = splat.split("/").map(decodeURIComponent)
  return Object.fromEntries(primaryKeys.map((pk, i) => [pk.name, values[i]]))
}

export function getResourceTableColumns({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema | null
}) {
  const schema = tableSchema?.schema ?? ""
  const resource = tableSchema?.name ?? ""

  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
  const joinedColumns: `${string}.${string}`[] = (
    tableMeta.query?.join ?? []
  ).flatMap((join) =>
    join.columns.map((col) => `${join.table}.${col}` as const),
  )

  const cols: ColumnDef<Record<string, unknown>, unknown>[] = []

  if (tableSchema?.primary_keys) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(!!checked)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Select row"
          />
          <Link
            to="/$schema/resource/$resource/view/$"
            params={{
              schema,
              resource,
              _splat: row.id,
            }}
            className="rounded border p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowUpRightIcon className="size-3" />
          </Link>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

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
        <ResourceColumnHeader
          column={column}
          title={name}
          tableSchema={tableSchema}
          columnSchema={col}
        />
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          columnSchema={col}
          tableSchema={tableSchema ?? null}
        />
      ),
      size: 170,
      enableSorting: true,
      enableHiding: true,
      enableColumnFilter: true,
      meta: getColumnFilterData(col),
    })
  }

  for (const col of joinedColumns) {
    cols.push({
      id: col,
      accessorKey: col,
      header: () => (
        <div className="flex items-center gap-2 truncate">
          <Link2Icon className="text-muted-foreground size-4 shrink-0" />
          <span>{formatTitle(col.replace(".", "_"))}</span>
        </div>
      ),
      size: 170,
      enableHiding: true,
    })
  }

  return cols
}

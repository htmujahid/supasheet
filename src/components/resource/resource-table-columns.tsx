import { Link } from "@tanstack/react-router"

import type { Column, ColumnDef, Row } from "@tanstack/react-table"

import { ArrowUpRightIcon, Link2Icon, PencilIcon } from "lucide-react"

import { Checkbox } from "#/components/ui/checkbox"
import { EditRecordTrigger } from "#/components/resource/triggers/edit-record-trigger"
import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  PrimaryKey,
  ResourceDataSchema,
  ResourceSchema,
  TableMetadata,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
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
  resourceSchema,
  canUpdate = false,
}: {
  columnsSchema: ColumnSchema[]
  resourceSchema: ResourceSchema
  canUpdate?: boolean
}) {
  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null
  const schema = resourceSchema.schema
  const resource = resourceSchema.name

  const tableMeta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
  const joinedColumns: `${string}.${string}`[] = (
    tableMeta.query?.join ?? []
  ).flatMap((join) => {
    const alias = join.on.endsWith("_id") ? join.on.slice(0, -3) : join.on
    return join.columns.map((col) => `${alias}.${col}` as const)
  })

  const cols: ColumnDef<Record<string, unknown>, unknown>[] = []

  if (tableSchema?.primary_keys) {
    const primaryKeys = (tableSchema.primary_keys ?? []) as PrimaryKey[]
    const primaryKeyNames = primaryKeys.map((k) => k.name)
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
      cell: ({ row }) => {
        const pk = Object.fromEntries(
          primaryKeys.map((k) => [k.name, row.original[k.name]])
        )
        return (
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(!!checked)}
              aria-label="Select row"
            />
            {canUpdate ? (
              <EditRecordTrigger
                pk={pk}
                primaryKeyNames={primaryKeyNames}
                size="icon-xs"
                variant="outline"
                className="opacity-0 transition-opacity group-hover:opacity-100 [&_svg]:size-3"
                stopPropagation
              >
                <PencilIcon />
              </EditRecordTrigger>
            ) : (
              <Link
                to="/$schema/resource/$resource/detail/$"
                params={{
                  schema,
                  resource,
                  _splat: row.id,
                }}
                className="inline-flex rounded border p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRightIcon className="size-3" />
              </Link>
            )}
          </div>
        )
      },
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
          resourceSchema={resourceSchema}
          columnSchema={col}
          isSorted={column.getIsSorted()}
        />
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          columnSchema={col}
          resourceSchema={resourceSchema}
        />
      ),
      size: 170,
      enableSorting: true,
      enableHiding: true,
      enableColumnFilter: true,
      meta: getColumnMetadata(tableSchema, col),
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
      enableColumnFilter: false,
      enableSorting: false,
    })
  }

  return cols
}

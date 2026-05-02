import { Link } from "@tanstack/react-router"

import type { ColumnDef, Row } from "@tanstack/react-table"

import { ArrowUpRightIcon } from "lucide-react"

import type {
  ColumnSchema,
  PrimaryKey,
  ResourceDataSchema,
  ResourceSchema,
} from "@/lib/database-meta.types"
import { isTableSchema } from "@/lib/database-meta.types"
import { formatTitle } from "@/lib/format"

import { getColumnMetadata } from "#/lib/columns"

import { ResourceRowCell } from "../resource-row-cell"

export function getResourceForeignTableColumns({
  columnsSchema,
  resourceSchema,
  data,
}: {
  columnsSchema: ColumnSchema[]
  resourceSchema: ResourceSchema
  data: ResourceDataSchema[]
}) {
  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null
  const hasPrimaryKeys =
    !!tableSchema && (tableSchema.primary_keys as PrimaryKey[] | null)?.length
      ? true
      : false

  const linkColumn: ColumnDef<ResourceDataSchema, unknown> | null =
    hasPrimaryKeys
      ? {
          id: "detail-link",
          header: () => null,
          cell: ({ row }) => (
            <Link
              to="/$schema/resource/$resource/detail/$"
              params={{
                schema: resourceSchema.schema,
                resource: resourceSchema.name,
                _splat: row.id,
              }}
              className="inline-flex rounded border p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRightIcon className="size-3" />
            </Link>
          ),
          size: 40,
          enableSorting: false,
          enableHiding: false,
          enableColumnFilter: false,
        }
      : null

  return [
    ...(linkColumn ? [linkColumn] : []),
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: () => (
        <div className="truncate select-none">
          {formatTitle(c.name as string)}
        </div>
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          columnSchema={c}
          resourceSchema={resourceSchema}
        />
      ),
      size: 150,
      enableColumnFilter: true,
      enableSorting: true,
      enableHiding: true,
      meta: getColumnMetadata(resourceSchema, c),
    })),
    ...(data.length > 0
      ? Object.keys(data[0]).map((key) => {
          const existingColumn = columnsSchema.find((c) => c.name === key)
          if (existingColumn) {
            return null
          }
          return {
            id: key,
            accessorKey: key,
            header: () => (
              <div className="truncate select-none">{formatTitle(key)}</div>
            ),
            cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
              <ResourceRowCell
                row={row}
                columnSchema={{ id: key, name: key } as ColumnSchema}
                resourceSchema={resourceSchema}
              />
            ),
            size: 150,
            enableColumnFilter: false,
            enableSorting: true,
            enableHiding: true,
          } as ColumnDef<ResourceDataSchema, unknown>
        })
      : []
    ).filter((c) => c !== null),
  ] as ColumnDef<ResourceDataSchema, unknown>[]
}

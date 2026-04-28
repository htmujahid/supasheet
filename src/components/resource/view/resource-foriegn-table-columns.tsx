import type { ColumnDef, Row } from "@tanstack/react-table"

import type {
  ColumnSchema,
  ResourceDataSchema,
  ResourceSchema,
} from "@/lib/database-meta.types"
import { formatTitle } from "@/lib/format"

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
  return [
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
      enableColumnFilter: false,
      enableSorting: true,
      enableHiding: true,
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

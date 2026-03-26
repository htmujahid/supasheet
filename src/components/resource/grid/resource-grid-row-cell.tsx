import { memo } from "react"

import type { Row } from "@tanstack/react-table"

import type {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "#/lib/database-meta.types"
import { cn } from "#/lib/utils"

export const ResourceGridRowCell = memo(function ({
  row,
  columnSchema,
  // tableSchema,
}: {
  row: Row<ResourceDataSchema>
  columnSchema: ColumnSchema
  tableSchema: TableSchema | null
}) {
  const value = row.original?.[columnSchema.name as keyof ResourceDataSchema]

  return (
    <div className={cn("relative truncate select-none")}>
      {typeof value === "object" ? JSON.stringify(value) : value?.toString()}
    </div>
  )
})

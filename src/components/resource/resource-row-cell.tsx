import { memo, useMemo } from "react"

import { Link } from "@tanstack/react-router"

import type { Row } from "@tanstack/react-table"

import { ArrowUpRightIcon } from "lucide-react"

import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  Relationship,
  ResourceDataSchema,
  ResourceSchema,
  TableSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { cn } from "#/lib/utils"

import { AllCells } from "./cells/all-cells"
import { ArrayCell } from "./cells/array-cell"

export const ResourceRowCell = memo(function ({
  row,
  columnSchema,
  resourceSchema,
}: {
  row: Row<ResourceDataSchema>
  columnSchema: ColumnSchema
  resourceSchema: ResourceSchema
}) {
  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null

  const columnData = useMemo(
    () => getColumnMetadata(tableSchema, columnSchema),
    [tableSchema, columnSchema]
  )

  const relationship = useMemo(
    () =>
      (tableSchema?.relationships as Relationship[])?.find(
        (r) => r.source_column_name === columnSchema.name
      ),
    [tableSchema?.relationships, columnSchema.name]
  )

  const value = row.original?.[columnSchema.name as keyof ResourceDataSchema]

  return (
    <div
      className={cn("relative truncate select-none", relationship && "pl-6")}
    >
      {columnData.isArray ? (
        <ArrayCell value={value as any[]} />
      ) : (
        <AllCells columnMetadata={columnData} value={value} />
      )}
      {/* {value?.toString()} */}
      {relationship && (
        <Link
          to={prepareForeignKeyLink(
            columnSchema.name as string,
            row.original?.[
              columnSchema.name as keyof ResourceDataSchema
            ]?.toString() ?? "",
            tableSchema
          )}
          target="_blank"
          className="absolute top-1/2 left-0 -translate-y-1/2 transform rounded border p-0.5"
        >
          <ArrowUpRightIcon className="size-3" />
        </Link>
      )}
    </div>
  )
})

function prepareForeignKeyLink(
  key: string,
  value: string,
  tableSchema: TableSchema | null
) {
  if (!tableSchema) return "#"

  const relationships = tableSchema.relationships as Relationship[]

  const relationship = relationships.find((r) => r.source_column_name === key)

  if (!relationship) return "#"

  return `/${relationship.target_table_schema}/resource/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"eq.${value}"}]`
}

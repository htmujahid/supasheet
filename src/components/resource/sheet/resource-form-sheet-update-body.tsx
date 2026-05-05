import { useSuspenseQuery } from "@tanstack/react-query"

import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import {
  columnsSchemaQueryOptions,
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

import { ResourceFormSheetForm } from "./resource-form-sheet-form"

export function ResourceFormSheetUpdateBody({
  schema,
  resource,
  pk,
  onClose,
}: {
  schema: string
  resource: string
  pk: Record<string, unknown>
  onClose: () => void
}) {
  const { data: tableSchema } = useSuspenseQuery(
    tableSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: columnsSchema } = useSuspenseQuery(
    columnsSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema as never, resource as never, pk)
  )

  if (!tableSchema || !columnsSchema?.length || !record) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
        Record unavailable.
      </div>
    )
  }

  return (
    <ResourceFormSheetForm
      mode="update"
      tableSchema={tableSchema as TableSchema}
      columnsSchema={columnsSchema as ColumnSchema[]}
      record={record}
      onClose={onClose}
    />
  )
}

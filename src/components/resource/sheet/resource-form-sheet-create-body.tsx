import { useSuspenseQuery } from "@tanstack/react-query"

import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import {
  columnsSchemaQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

import { ResourceFormSheetForm } from "./resource-form-sheet-form"

export function ResourceFormSheetCreateBody({
  schema,
  resource,
  defaults,
  onClose,
}: {
  schema: string
  resource: string
  defaults?: Record<string, string>
  onClose: () => void
}) {
  const { data: tableSchema } = useSuspenseQuery(
    tableSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: columnsSchema } = useSuspenseQuery(
    columnsSchemaQueryOptions(schema as never, resource as never)
  )

  if (!tableSchema || !columnsSchema?.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
        Schema unavailable.
      </div>
    )
  }

  return (
    <ResourceFormSheetForm
      mode="create"
      tableSchema={tableSchema as TableSchema}
      columnsSchema={columnsSchema as ColumnSchema[]}
      record={null}
      defaults={defaults}
      onClose={onClose}
    />
  )
}

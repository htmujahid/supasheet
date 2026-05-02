import { useMemo } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { toast } from "sonner"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import { useDataTable } from "#/hooks/use-data-table"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import type { AppPermission } from "#/lib/supabase/data/core"
import { deleteResourceMutationOptions } from "#/lib/supabase/data/resource"

import { getResourceTableColumns } from "./resource-table-columns"

interface ResourceTableProps {
  data: Record<string, unknown>[]
  columnsSchema: ColumnSchema[]
  resourceSchema: ResourceSchema
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function ResourceTable({
  data,
  columnsSchema,
  resourceSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: ResourceTableProps) {
  const queryClient = useQueryClient()
  const schema = resourceSchema.schema
  const resource = resourceSchema.name
  const primaryKeys = (
    isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]

  const canDelete = useHasPermission(
    `${schema}.${resource}:delete` as AppPermission
  )

  const { mutateAsync: deleteRow } = useMutation(
    deleteResourceMutationOptions(schema, resource)
  )

  const handleDelete = async (rows: Record<string, unknown>[]) => {
    try {
      await Promise.all(
        rows.map((row) => {
          const pk = Object.fromEntries(
            primaryKeys.map((key) => [key.name, row[key.name]])
          )
          return deleteRow(pk)
        })
      )
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource],
      })
      toast.success(
        rows.length === 1 ? "Record deleted" : `${rows.length} records deleted`
      )
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete record"
      )
    }
  }

  const columns = useMemo(
    () => getResourceTableColumns({ columnsSchema, resourceSchema }),
    [columnsSchema, resourceSchema]
  )

  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    getRowId: (row) => primaryKeys.map((key) => row[key.name]).join("/"),
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        onDelete={canDelete ? handleDelete : undefined}
      />
    </DataTable>
  )
}

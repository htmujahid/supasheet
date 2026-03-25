import { useMemo } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { toast } from "sonner"

import { DataTable } from "#/components/data-table/data-table"
import { useDataTable } from "#/hooks/use-data-table"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import type { AppPermission } from "#/lib/supabase/data/core"
import { deleteResourceMutationOptions } from "#/lib/supabase/data/resource"

import { getResourceTableColumns } from "./resource-table-columns"

interface ResourceTableProps {
  schema: string
  resource: string
  data: Record<string, unknown>[]
  columnsSchema: ColumnSchema[]
  primaryKeys: PrimaryKey[]
  isTable: boolean
  tableSchema: TableSchema | null
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function ResourceTable({
  schema,
  resource,
  data,
  columnsSchema,
  primaryKeys,
  isTable,
  tableSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: ResourceTableProps) {
  const queryClient = useQueryClient()
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
    () => getResourceTableColumns({ columnsSchema, isTable, tableSchema }),
    [columnsSchema, isTable, tableSchema]
  )

  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    getRowId: (row) => primaryKeys.map((key) => row[key.name]).join("/"),
  })

  return (
    <DataTable
      table={table}
      onDelete={isTable && canDelete ? handleDelete : undefined}
    />
  )
}

import { useCallback, useMemo } from "react"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import { DataGrid } from "#/components/data-grid/data-grid"
import { useDataTable } from "#/hooks/use-data-table"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import { updateResourceMutationOptions } from "#/lib/supabase/data/resource"

import { getResourceGridColumns } from "./resource-grid-columns"

interface ResourceGridProps {
  data: Record<string, unknown>[]
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema | null
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function ResourceGrid({
  data,
  columnsSchema,
  tableSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: ResourceGridProps) {
  const queryClient = useQueryClient()
  const schema = tableSchema?.schema ?? ""
  const resource = tableSchema?.name ?? ""
  const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]

  const columns = useMemo(
    () => getResourceGridColumns({ columnsSchema, tableSchema }),
    [columnsSchema, tableSchema]
  )

  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    getRowId: (row) => primaryKeys.map((key) => row[key.name]).join("/"),
  })

  const { mutateAsync: updateRow } = useMutation(
    updateResourceMutationOptions(schema, resource)
  )

  const handleRowsChange = useCallback(
    (
      rows: Record<string, unknown>[],
      { indexes, column }: { indexes: number[]; column: { key: string } }
    ) => {
      const updatedRow = rows[indexes[0]]
      if (!updatedRow) return

      const pk = Object.fromEntries(
        primaryKeys.map((k) => [k.name, updatedRow[k.name]])
      )

      const fieldKey = column.key
      let value = updatedRow[fieldKey]

      if (value === "" || value === null || value === undefined) {
        value = null
      } else {
        const col = columnsSchema.find((c) => (c.name ?? c.id) === fieldKey)
        if (
          col &&
          (col.format === "json" || col.format === "jsonb") &&
          typeof value === "string"
        ) {
          try {
            value = JSON.parse(value)
          } catch {}
        }
      }

      updateRow({ pk, data: { [fieldKey]: value } })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["supasheet", "resource-data", schema, resource],
          })
          toast.success("Record updated")
        })
        .catch((err: Error) => {
          toast.error(err.message ?? "Failed to update record")
        })
    },
    [primaryKeys, columnsSchema, updateRow, queryClient, schema, resource]
  )

  return (
    <DataGrid table={table} onDelete={undefined} onRowsChange={handleRowsChange} />
  )
}

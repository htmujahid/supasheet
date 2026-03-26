import { useMemo } from "react"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { DataGrid } from "#/components/data-grid/data-grid"
import { useDataGrid } from "#/hooks/use-data-grid"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"

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
  const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]

  const columns = useMemo(
    () => getResourceGridColumns({ columnsSchema, tableSchema }),
    [columnsSchema, tableSchema]
  )

  const table = useDataGrid({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    getRowId: (row) => primaryKeys.map((key) => row[key.name]).join("/"),
  })

  return <DataGrid table={table} onDelete={undefined} />
}

import { useMemo } from "react"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import { useDataTable } from "#/hooks/use-data-table"
import type { ColumnSchema } from "#/lib/database-meta.types"

import { getReportTableColumns } from "./report-table-columns"

interface ReportTableProps {
  data: Record<string, unknown>[]
  columnsSchema: ColumnSchema[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function ReportTable({
  data,
  columnsSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: ReportTableProps) {
  const columns = useMemo(
    () => getReportTableColumns(columnsSchema),
    [columnsSchema]
  )

  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  )
}

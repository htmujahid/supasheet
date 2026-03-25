import { useMemo } from "react"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { DataTable } from "#/components/data-table/data-table"
import { useDataTable } from "#/hooks/use-data-table"

import type { AuditLog } from "./audit-logs-table-columns"
import { getAuditLogsTableColumns } from "./audit-logs-table-columns"

interface AuditLogTableProps {
  data: AuditLog[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function AuditLogTable({
  data,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: AuditLogTableProps) {
  const columns = useMemo(() => getAuditLogsTableColumns(), [])
  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
  })
  return <DataTable table={table} />
}

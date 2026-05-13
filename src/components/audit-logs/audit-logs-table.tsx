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

import type { AuditLog } from "./audit-logs-table-columns"
import { getAuditLogsTableColumns } from "./audit-logs-table-columns"

interface AuditLogTableProps {
  data: AuditLog[]
  columnsSchema: ColumnSchema<"supasheet">[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function AuditLogTable({
  data,
  columnsSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: AuditLogTableProps) {
  const columns = useMemo(
    () => getAuditLogsTableColumns({ columnsSchema }),
    [columnsSchema]
  )
  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    meta: { filename: "audit_logs" },
  })
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  )
}

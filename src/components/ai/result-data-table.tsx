import { useMemo, useState } from "react"

import type {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { DataTableColumnVisibility } from "#/components/data-table/data-table-column-visibility"
import { DataTableExportButton } from "#/components/data-table/data-table-toolbar"

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return ""
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

export function ResultDataTable({
  rows,
  summary,
  question,
}: {
  rows: Record<string, unknown>[]
  summary: string
  question: string
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (rows.length === 0) return []
    return Object.keys(rows[0]).map((key) => ({
      id: key,
      accessorKey: key,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={key} />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {formatCell(row.getValue(key))}
        </span>
      ),
      sortingFn: (a, b, id) => {
        const av = a.getValue(id)
        const bv = b.getValue(id)
        if (av === null || av === undefined) return 1
        if (bv === null || bv === undefined) return -1
        if (typeof av === "number" && typeof bv === "number") return av - bv
        return String(av).localeCompare(String(bv), undefined, {
          numeric: true,
        })
      },
    }))
  }, [rows])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, pagination, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: { filename: "ai-result" },
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground">You asked:</span>{" "}
            {question}
          </p>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <DataTableExportButton table={table} filename="ai-result" />
          <DataTableColumnVisibility table={table} />
        </div>
      </div>
      <DataTable table={table} />
    </div>
  )
}

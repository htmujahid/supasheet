import type { ReactNode } from "react"

import type { Table } from "@tanstack/react-table"

import { DownloadIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { exportTableToCSV } from "#/lib/export"

import { DataTableColumnVisibility } from "./data-table-column-visibility"
import { DataTableFilter } from "./data-table-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  hideColumnVisibility?: boolean
  // Rendered immediately to the right of the Filter button on the left side
  // of the toolbar (e.g. filter templates).
  children?: ReactNode
}

export function DataTableToolbar<TData>({
  table,
  hideColumnVisibility,
  children,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <DataTableFilter table={table} />
        {children}
      </div>
      <div className="flex items-center gap-2">
        <DataTableExportButton
          table={table}
          excludeColumns={["select"]}
          filename={table.options.meta?.filename}
        />
        {!hideColumnVisibility && <DataTableColumnVisibility table={table} />}
      </div>
    </div>
  )
}

export function DataTableExportButton<TData>({
  table,
  filename,
  excludeColumns,
}: {
  table: Table<TData>
  filename?: string
  excludeColumns?: (keyof TData | "select" | "actions")[]
}) {
  const onlySelected = table.getSelectedRowModel().rows.length > 0
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        exportTableToCSV(table, {
          filename,
          excludeColumns,
          onlySelected,
        })
      }
    >
      <DownloadIcon className="size-4" />
      Export
    </Button>
  )
}

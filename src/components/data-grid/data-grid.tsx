import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import type { Column } from "react-data-grid"

import { DataGrid as ReactDataGrid } from "#/components/ui/data-grid"
import { cn } from "#/lib/utils"

import { DataTablePagination } from "../data-table/data-table-pagination"
import { DataTableToolbar } from "../data-table/data-table-toolbar"

interface DataGridProps<TData> {
  table: Table<TData>
  onDelete?: (rows: TData[]) => void | Promise<void>
  className?: string
}

export function DataGrid<TData>({
  table,
  onDelete,
  className,
}: DataGridProps<TData>) {
  const gridRows = table
    .getRowModel()
    .rows.map((row) => row.original as Record<string, unknown>)

  const gridColumns: Column<Record<string, unknown>>[] = table
    .getHeaderGroups()
    .flatMap((headerGroup) => {
      return headerGroup.headers.map((header) => ({
        key: header.id,
        name: header.id,
        renderHeaderCell: () =>
          header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext()),
      } as Column<Record<string, unknown>>))
    })

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <DataTableToolbar table={table} onDelete={onDelete} />
      <ReactDataGrid
        className="h-min! overflow-auto!"
        columns={gridColumns}
        rows={gridRows}
        defaultColumnOptions={{ resizable: true }}
        renderers={{
          noRowsFallback: (
            <div className="py-12 text-center col-span-full">No Results.</div>
          ),
        }}
      />
      <DataTablePagination table={table} />
    </div>
  )
}

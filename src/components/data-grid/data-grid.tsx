import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from "#/components/ui/table"
import { getCommonPinningStyles } from "#/lib/data-grid"
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
  const colCount = table.getAllColumns().length

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <DataTableToolbar table={table} onDelete={onDelete} />
      <div className="overflow-auto rounded-md border">
        <TableRoot
          className="table-fixed"
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {header.column.getCanResize() && (
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className:
                            "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-[0px]",
                          style: {
                            userSelect: "none",
                            touchAction: "none",
                          },
                        }}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                      className="border-r"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

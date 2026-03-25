import { useEffect, useState } from "react"

import type { Table } from "@tanstack/react-table"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { NativeSelect, NativeSelectOption } from "#/components/ui/native-select"

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalPages = table.getPageCount()
  const currentPage = pageIndex + 1

  const [pageInput, setPageInput] = useState(String(currentPage))

  useEffect(() => {
    setPageInput(String(currentPage))
  }, [currentPage])

  const commitPage = () => {
    const parsed = parseInt(pageInput, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      table.setPageIndex(parsed - 1)
    } else {
      setPageInput(String(currentPage))
    }
  }

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {table.options.enableRowSelection && (
        <span className="text-sm text-muted-foreground">
          {selectedCount} of {table.getFilteredRowModel().rows.length} rows
          selected
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm whitespace-nowrap text-muted-foreground sm:inline">
            Rows per page
          </span>
          <NativeSelect
            size="sm"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <NativeSelectOption key={size} value={size}>
                {size}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="hidden text-muted-foreground sm:inline">Page</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={commitPage}
              onKeyDown={(e) => e.key === "Enter" && commitPage()}
              className="h-7 w-12 [appearance:textfield] px-1.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-muted-foreground">of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

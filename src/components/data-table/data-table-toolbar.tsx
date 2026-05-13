import { useState } from "react"
import type { ReactNode } from "react"

import type { Table } from "@tanstack/react-table"

import { DownloadIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog"
import { Button } from "#/components/ui/button"
import { exportTableToCSV } from "#/lib/export"

import { DataTableColumnVisibility } from "./data-table-column-visibility"
import { DataTableFilter } from "./data-table-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onDelete?: (rows: TData[]) => void | Promise<void>
  hideColumnVisibility?: boolean
  // Action buttons rendered between the delete button and column visibility.
  // When omitted, a default Export button is rendered.
  children?: ReactNode
}

export function DataTableToolbar<TData>({
  table,
  onDelete,
  hideColumnVisibility,
  children,
}: DataTableToolbarProps<TData>) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  async function handleConfirm() {
    await onDelete?.(selectedRows.map((r) => r.original))
    table.resetRowSelection()
    setConfirmOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DataTableFilter table={table} />
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2Icon className="size-4" />
              Delete ({selectedCount})
            </Button>
          )}
          {children ?? (
            <DataTableExportButton
              table={table}
              excludeColumns={["select"]}
              filename={table.options.meta?.filename}
            />
          )}
          {!hideColumnVisibility && <DataTableColumnVisibility table={table} />}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedCount} {selectedCount === 1 ? "row" : "rows"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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

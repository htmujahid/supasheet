import { useState } from "react"

import { Link } from "@tanstack/react-router"

import type { Table } from "@tanstack/react-table"

import { DownloadIcon, PlusIcon, Trash2Icon } from "lucide-react"

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
  exportFilename?: string
  excludeColumns?: (keyof TData | "select" | "actions")[]
  newRecordUrl?: string
}

export function DataTableToolbar<TData>({
  table,
  onDelete,
  exportFilename,
  excludeColumns,
  newRecordUrl,
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
          {newRecordUrl ? (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link to={newRecordUrl as never} />}
            >
              <PlusIcon className="size-4" />
              New record
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportTableToCSV(table, {
                  filename: exportFilename,
                  excludeColumns,
                  onlySelected: selectedCount > 0,
                })
              }
            >
              <DownloadIcon className="size-4" />
              Export
            </Button>
          )}
          <DataTableColumnVisibility table={table} />
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

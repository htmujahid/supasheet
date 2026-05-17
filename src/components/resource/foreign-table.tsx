import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import type {
  Relationship,
  ResourceDataSchema,
} from "@/lib/database-meta.types"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import {
  columnsSchemaQueryOptions,
  resourceDataQueryOptions,
} from "#/lib/supabase/data/resource"

import { foreignTableColumns } from "./foreign-table-columns"

type ForeignTableDialogProps = React.ComponentPropsWithRef<typeof Dialog> & {
  relationship: Relationship
  setRecord: (record: ResourceDataSchema) => void
}

export function ForeignTableDialog({
  relationship,
  setRecord,
  ...props
}: ForeignTableDialogProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const sortCol = sorting[0]

  const { data } = useQuery(
    resourceDataQueryOptions(
      relationship.target_table_schema,
      relationship.target_table_name,
      {},
      pagination.pageIndex + 1,
      pagination.pageSize,
      sortCol?.id,
      sortCol?.desc,
      columnFilters
    )
  )

  const { data: columnsSchema } = useQuery(
    columnsSchemaQueryOptions(
      relationship.target_table_schema,
      relationship.target_table_name
    )
  )

  const columns = useMemo(
    () =>
      foreignTableColumns({
        columnsSchema: columnsSchema ?? [],
        setRecord,
      }),
    [columnsSchema, setRecord]
  )

  const table = useReactTable({
    data: data?.result ?? [],
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: data?.count ?? 0,
    enableRowSelection: false,
  })

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Select to reference from {relationship.target_table_name}
          </DialogTitle>
          <DialogDescription>
            Select a record from the table to create a reference.
          </DialogDescription>
        </DialogHeader>
        {columnsSchema && !columnsSchema.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </EmptyMedia>
              <EmptyTitle>Access Denied</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>
                You don&apos;t have permission to access this table.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex max-h-[60vh] flex-col overflow-hidden">
            <DataTable
              table={table}
              className="min-h-0 flex-1 [&>div:nth-child(2)]:min-h-0 [&>div:nth-child(2)]:flex-1 [&>div:nth-child(2)]:overflow-x-hidden [&>div:nth-child(2)]:overflow-y-auto"
            >
              <DataTableToolbar table={table} />
            </DataTable>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

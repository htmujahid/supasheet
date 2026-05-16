import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
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
import { useIsMobile } from "#/hooks/use-mobile"
import {
  columnsSchemaQueryOptions,
  resourceDataQueryOptions,
} from "#/lib/supabase/data/resource"
import { cn } from "#/lib/utils"

import { foreignTableColumns } from "./foreign-table-columns"

type ForeignTableDrawerProps = React.ComponentPropsWithRef<typeof Drawer> & {
  relationship: Relationship
  setRecord: (record: ResourceDataSchema) => void
}

export function ForeignTableDrawer({
  relationship,
  setRecord,
  ...props
}: ForeignTableDrawerProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const isMobile = useIsMobile()
  const direction = isMobile ? "bottom" : "right"

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
    <Drawer direction={direction} {...props}>
      <DrawerContent
        className={cn(
          "flex h-full w-full flex-col overflow-hidden",
          direction === "right" && "sm:max-w-lg!"
        )}
      >
        <DrawerHeader>
          <DrawerTitle>
            Select to reference from {relationship.target_table_name}
          </DrawerTitle>
          <DrawerDescription>
            Select a record from the table to create a reference.
          </DrawerDescription>
        </DrawerHeader>
        <div className="data-table-container px-4">
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
            <DataTable
              table={table}
              className="[&>div:nth-child(2)]:h-[calc(100svh-174px)]"
            >
              <DataTableToolbar table={table} />
            </DataTable>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

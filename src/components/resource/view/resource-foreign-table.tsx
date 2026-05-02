"use client"

import { useMemo, useState } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { DataTable } from "#/components/data-table/data-table"
import type {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { foreignTableDataQueryOptions } from "#/lib/supabase/data/resource"

import { getResourceForeignTableColumns } from "./resource-foriegn-table-columns"

type ResourceForeignTableProps<S extends DatabaseSchemas> = {
  schema: S
  table: DatabaseTables<S> | DatabaseViews<S>
  parentColumn: string
  parentValue: unknown
  resourceSchema: ResourceSchema & { columns: ColumnSchema[] }
  columnsSchema: ColumnSchema[]
  selectClause?: string
}

export function ResourceForeignTable<S extends DatabaseSchemas>({
  schema,
  table,
  parentColumn,
  parentValue,
  resourceSchema,
  columnsSchema,
  selectClause = "*",
}: ResourceForeignTableProps<S>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const sortId = sorting[0]?.id
  const sortDesc = sorting[0]?.desc ?? false

  const primaryKeys = (
    isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]

  const hasParentValue =
    parentValue !== undefined && parentValue !== null && parentValue !== ""

  const { data: queryResult } = useSuspenseQuery(
    foreignTableDataQueryOptions(
      schema,
      table,
      parentColumn,
      hasParentValue ? parentValue : "__noop__",
      selectClause,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sortId,
      sortDesc,
      columnFilters
    )
  )

  const data = hasParentValue ? (queryResult?.result ?? []) : []
  const totalCount = hasParentValue ? (queryResult?.count ?? 0) : 0
  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize))

  const columns = useMemo(
    () =>
      getResourceForeignTableColumns({
        data,
        columnsSchema,
        resourceSchema,
      }),
    [data, columnsSchema, resourceSchema]
  )

  const tableInstance = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    getRowId: primaryKeys.length
      ? (row) =>
          primaryKeys
            .map((key) => (row)[key.name])
            .join("/")
      : undefined,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={tableInstance} />
}

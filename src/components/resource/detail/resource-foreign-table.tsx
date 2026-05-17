"use client"

import { useMemo, useState } from "react"

import { useLocation } from "@tanstack/react-router"

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import { NewRecordTrigger } from "#/components/resource/drawer/new-record-trigger"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import {
  deleteResourceMutationOptions,
  foreignTableDataQueryOptions,
} from "#/lib/supabase/data/resource"

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
  const queryClient = useQueryClient()
  const location = useLocation()
  const redirectTo = location.href
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

  const canUpdate = useHasPermission(
    `${schema}.${table}:update`
  )
  const canDelete = useHasPermission(
    `${schema}.${table}:delete`
  )
  const canInsert = useHasPermission(
    `${schema}.${table}:insert`
  )

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

  const { mutateAsync: deleteRow } = useMutation(
    deleteResourceMutationOptions(schema, table)
  )

  const handleDelete = async (rows: Record<string, unknown>[]) => {
    try {
      await Promise.all(
        rows.map((row) => {
          const pk = Object.fromEntries(
            primaryKeys.map((key) => [key.name, row[key.name]])
          )
          return deleteRow(pk)
        })
      )
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, table],
      })
      toast.success(
        rows.length === 1 ? "Record deleted" : `${rows.length} records deleted`
      )
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete record"
      )
    }
  }

  const columns = useMemo(
    () =>
      getResourceForeignTableColumns({
        data,
        columnsSchema,
        resourceSchema,
        canUpdate,
        redirect: redirectTo,
      }),
    [data, columnsSchema, resourceSchema, canUpdate, redirectTo]
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
      ? (row) => primaryKeys.map((key) => row[key.name]).join("/")
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

  const defaults = hasParentValue
    ? { [parentColumn]: String(parentValue) }
    : undefined

  const newRecordUrl = (() => {
    const params = new URLSearchParams()
    params.set("redirect", redirectTo)
    if (defaults) params.set("defaults", JSON.stringify(defaults))
    return `/${schema}/resource/${table}/new?${params.toString()}`
  })()

  return (
    <DataTable table={tableInstance}>
      <DataTableToolbar
        table={tableInstance}
        onDelete={canDelete && primaryKeys.length ? handleDelete : undefined}
      >
        {canInsert && (
          <NewRecordTrigger
            schema={schema}
            resource={table}
            defaults={defaults}
            url={newRecordUrl}
            size="sm"
          >
            <PlusIcon className="size-4" />
            New record
          </NewRecordTrigger>
        )}
      </DataTableToolbar>
    </DataTable>
  )
}

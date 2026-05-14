import { useMemo } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { toast } from "sonner"

import { DataTablePagination } from "#/components/data-table/data-table-pagination"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import { useDataTable } from "#/hooks/use-data-table"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  FilterTemplate,
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import type { AppPermission } from "#/lib/supabase/data/core"
import { deleteResourceMutationOptions } from "#/lib/supabase/data/resource"

import { ResourceFilterTemplates } from "../resource-filter-templates"
import { getResourceTableColumns } from "../resource-table-columns"
import { ResourceListEmpty } from "./resource-list-empty"
import { ResourceListRow } from "./resource-list-row"

export type ListView = {
  id: string
  name: string
  title?: string
  description?: string
  field1?: string
  field2?: string
  [key: string]: unknown
}

interface ResourceListProps {
  data: Record<string, unknown>[]
  columnsSchema: ColumnSchema[]
  resourceSchema: ResourceSchema
  listView: ListView
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
  filterTemplates?: FilterTemplate[]
}

export function ResourceList({
  data,
  columnsSchema,
  resourceSchema,
  listView,
  sorting,
  pagination,
  columnFilters,
  pageCount,
  filterTemplates = [],
}: ResourceListProps) {
  const queryClient = useQueryClient()
  const schema = resourceSchema.schema
  const resource = resourceSchema.name
  const isTable = isTableSchema(resourceSchema)
  const primaryKeys = (
    isTable ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]

  const canDelete = useHasPermission(
    `${schema}.${resource}:delete` as AppPermission
  )
  const canUpdate = useHasPermission(
    `${schema}.${resource}:update` as AppPermission
  )

  const { mutateAsync: deleteRow } = useMutation(
    deleteResourceMutationOptions(schema, resource)
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
        queryKey: ["supasheet", "resource-data", schema, resource],
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
    () => getResourceTableColumns({ columnsSchema, resourceSchema, canUpdate }),
    [columnsSchema, resourceSchema, canUpdate]
  )

  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
    getRowId: (row) => primaryKeys.map((key) => row[key.name]).join("/"),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex w-full flex-col gap-2">
      <DataTableToolbar
        table={table}
        onDelete={canDelete ? handleDelete : undefined}
        hideColumnVisibility
      >
        <ResourceFilterTemplates
          filterTemplates={filterTemplates}
          currentFilters={columnFilters}
        />
      </DataTableToolbar>
      {rows.length === 0 ? (
        <ResourceListEmpty />
      ) : (
        <div className="divide-y overflow-hidden rounded-md border bg-card">
          {rows.map((row) => (
            <ResourceListRow
              key={row.id}
              row={row}
              listView={listView}
              schema={schema}
              resource={resource}
              primaryKeys={primaryKeys}
              canUpdate={isTable && canUpdate}
            />
          ))}
        </div>
      )}
      <DataTablePagination table={table} />
    </div>
  )
}

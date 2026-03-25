import { useMemo } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { toast } from "sonner"

import { DataTable } from "#/components/data-table/data-table"
import { useDataTable } from "#/hooks/use-data-table"
import { useHasPermission } from "#/hooks/use-permissions"
import type { ColumnSchema } from "#/lib/database-meta.types"
import type { Database } from "#/lib/database.types"
import { deleteRolePermissionsMutationOptions } from "#/lib/supabase/data/core"

import { getRolePermissionsTableColumns } from "./role-permissions-table-columns"

type RolePermission = Database["supasheet"]["Tables"]["role_permissions"]["Row"]

interface RolePermissionsTableProps {
  data: RolePermission[]
  columnsSchema: ColumnSchema[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function RolePermissionsTable({
  data,
  columnsSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: RolePermissionsTableProps) {
  const queryClient = useQueryClient()
  const canDelete = useHasPermission("supasheet.role_permissions:delete")
  const columns = useMemo(
    () => getRolePermissionsTableColumns({ columnsSchema }),
    [columnsSchema]
  )
  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
  })

  const { mutateAsync: deleteRolePermissions } = useMutation({
    ...deleteRolePermissionsMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "role_permissions"],
      })
      toast.success("Role permissions deleted")
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete role permissions"
      )
    },
  })

  return (
    <DataTable
      table={table}
      onDelete={
        canDelete
          ? (rows) => deleteRolePermissions(rows.map((r) => r.id))
          : undefined
      }
    />
  )
}

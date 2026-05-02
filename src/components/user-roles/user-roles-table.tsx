import { useMemo } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import { toast } from "sonner"

import { DataTable } from "#/components/data-table/data-table"
import { DataTableToolbar } from "#/components/data-table/data-table-toolbar"
import { useDataTable } from "#/hooks/use-data-table"
import { useHasPermission } from "#/hooks/use-permissions"
import type { ColumnSchema } from "#/lib/database-meta.types"
import { deleteUserRolesMutationOptions } from "#/lib/supabase/data/core"

import { getUserRolesTableColumns } from "./user-roles-table-columns"
import type { UserRole } from "./user-roles-table-columns"

interface UserRolesTableProps {
  data: UserRole[]
  columnsSchema: ColumnSchema<"supasheet">[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function UserRolesTable({
  data,
  columnsSchema,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: UserRolesTableProps) {
  const queryClient = useQueryClient()
  const canDelete = useHasPermission("supasheet.user_roles:delete")
  const columns = useMemo(
    () => getUserRolesTableColumns({ columnsSchema }),
    [columnsSchema]
  )
  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
  })

  const { mutateAsync: deleteUserRoles } = useMutation({
    ...deleteUserRolesMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supasheet", "user_roles"] })
      toast.success("User roles deleted")
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete user roles"
      )
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        onDelete={
          canDelete
            ? (rows) => deleteUserRoles(rows.map((r) => r.id))
            : undefined
        }
      />
    </DataTable>
  )
}

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
import { adminDeleteUserMutationOptions } from "#/lib/supabase/data/admin-auth"

import { getUsersTableColumns } from "./users-table-columns"
import type { User } from "./users-table-columns"

interface UsersTableProps {
  data: User[]
  sorting: SortingState
  pagination: PaginationState
  columnFilters: ColumnFiltersState
  pageCount: number
}

export function UsersTable({
  data,
  sorting,
  pagination,
  columnFilters,
  pageCount,
}: UsersTableProps) {
  const queryClient = useQueryClient()
  const canDelete = useHasPermission("supasheet.users:delete")
  const columns = useMemo(() => getUsersTableColumns(), [])
  const table = useDataTable({
    columns,
    data,
    pageCount,
    state: { sorting, pagination, columnFilters },
  })

  const { mutateAsync: deleteUser } = useMutation(
    adminDeleteUserMutationOptions
  )

  const handleDelete = async (rows: User[]) => {
    try {
      await Promise.all(rows.map((r) => deleteUser(r.id)))
      queryClient.invalidateQueries({ queryKey: ["supasheet", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "auth", "users"] })
      toast.success(
        rows.length === 1 ? "User deleted" : `${rows.length} users deleted`
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete users")
    }
  }

  return (
    <DataTable table={table} onDelete={canDelete ? handleDelete : undefined} />
  )
}

import { Link } from "@tanstack/react-router"

import type { ColumnDef } from "@tanstack/react-table"

import { CalendarIcon, UserIcon } from "lucide-react"

import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Checkbox } from "#/components/ui/checkbox"
import type { Database } from "#/lib/database.types"
import type { ColumnMeta } from "#/types/data-table"

export type { ColumnMeta }

export type User = Database["supasheet"]["Tables"]["users"]["Row"]

export function getUsersTableColumns(): ColumnDef<User, unknown>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(!!checked)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <Link
          to="/core/users/$userId"
          params={{ userId: row.original.id }}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {row.original.id}
        </Link>
      ),
      meta: {
        label: "ID",
        variant: "text",
        placeholder: "Filter by ID...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue<string>("name")
        const pictureUrl = row.original.picture_url
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src={pictureUrl ?? undefined} alt={name} />
              <AvatarFallback className="text-xs">
                {name.slice(0, 2).toUpperCase() || (
                  <UserIcon className="size-3" />
                )}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: {
        label: "Name",
        variant: "text",
        placeholder: "Search by name...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("email") ?? "—"}
        </span>
      ),
      meta: {
        label: "Email",
        variant: "text",
        placeholder: "Search by email...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string | null>("created_at")
        if (!value)
          return <span className="text-sm text-muted-foreground">—</span>
        return (
          <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
              new Date(value)
            )}
          </span>
        )
      },
      meta: {
        label: "Created At",
        variant: "timestamptz",
        icon: CalendarIcon,
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string | null>("updated_at")
        if (!value)
          return <span className="text-sm text-muted-foreground">—</span>
        return (
          <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
              new Date(value)
            )}
          </span>
        )
      },
      meta: {
        label: "Updated At",
        variant: "timestamptz",
        icon: CalendarIcon,
      } satisfies ColumnMeta,
    },
  ]
}

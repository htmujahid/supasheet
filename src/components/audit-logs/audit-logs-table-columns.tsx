import { Link } from "@tanstack/react-router"

import type { ColumnDef } from "@tanstack/react-table"

import { AlertCircleIcon, CalendarIcon } from "lucide-react"

import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { Badge } from "#/components/ui/badge"
import { Checkbox } from "#/components/ui/checkbox"
import type { Database } from "#/lib/database.types"
import type { ColumnMeta } from "#/types/data-table"

export type { ColumnMeta }

export type AuditLog = Database["supasheet"]["Tables"]["audit_logs"]["Row"]

export function getAuditLogsTableColumns(): ColumnDef<AuditLog, unknown>[] {
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
          to="/core/audit_logs/$auditLogId"
          params={{ auditLogId: row.original.id }}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {row.original.id.slice(0, 8)}…
        </Link>
      ),
      meta: {
        label: "ID",
        variant: "text",
        placeholder: "Filter by ID...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string>("created_at")
        return (
          <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(value))}
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
      accessorKey: "operation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Operation" />
      ),
      cell: ({ row }) => {
        const op = row.getValue<string>("operation")
        const variant =
          op === "INSERT"
            ? "default"
            : op === "UPDATE"
              ? "secondary"
              : op === "DELETE"
                ? "destructive"
                : "outline"
        return <Badge variant={variant}>{op}</Badge>
      },
      meta: {
        label: "Operation",
        variant: "select",
        options: [
          { label: "INSERT", value: "INSERT" },
          { label: "UPDATE", value: "UPDATE" },
          { label: "DELETE", value: "DELETE" },
        ],
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "schema_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Schema" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.getValue("schema_name")}
        </span>
      ),
      meta: {
        label: "Schema",
        variant: "text",
        placeholder: "Filter by schema...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "table_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Table" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("table_name")}</span>
      ),
      meta: {
        label: "Table",
        variant: "text",
        placeholder: "Filter by table...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "record_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Record ID" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string | null>("record_id")
        return (
          <span className="font-mono text-sm text-muted-foreground">
            {value ?? "—"}
          </span>
        )
      },
      meta: {
        label: "Record ID",
        variant: "number",
        placeholder: "Filter by record ID...",
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string | null>("role")
        if (!value)
          return <span className="text-sm text-muted-foreground">—</span>
        return <Badge variant="outline">{value}</Badge>
      },
      meta: {
        label: "Role",
        variant: "select",
        options: [
          { label: "x-admin", value: "x-admin" },
          { label: "user", value: "user" },
        ],
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "user_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User Type" />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string>("user_type")
        return (
          <Badge variant={value === "system" ? "secondary" : "outline"}>
            {value}
          </Badge>
        )
      },
      meta: {
        label: "User Type",
        variant: "select",
        options: [
          { label: "Real User", value: "real_user" },
          { label: "System", value: "system" },
        ],
      } satisfies ColumnMeta,
    },
    {
      accessorKey: "is_error",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Error" />
      ),
      cell: ({ row }) => {
        const isError = row.getValue("is_error")
        if (!isError)
          return <span className="text-sm text-muted-foreground">—</span>
        return (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircleIcon className="size-4" />
            <span className="text-sm font-medium">Error</span>
          </div>
        )
      },
      meta: {
        label: "Error",
        variant: "boolean",
        icon: AlertCircleIcon,
      } satisfies ColumnMeta,
    },
  ]
}

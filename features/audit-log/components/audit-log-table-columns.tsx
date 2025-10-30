"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import {
  Bot,
  CheckCircle,
  Database,
  Edit,
  ExternalLink,
  Plus,
  Table,
  Trash,
  User,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AuditLogWithAccount } from "../lib/types";

const operationIcons = {
  INSERT: <Plus className="h-4 w-4 text-green-500" />,
  UPDATE: <Edit className="h-4 w-4 text-blue-500" />,
  DELETE: <Trash className="h-4 w-4 text-red-500" />,
};

const operationColors = {
  INSERT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const auditLogTableColumns: ColumnDef<AuditLogWithAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 320,
    minSize: 280,
    maxSize: 400,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Link
          href={`/home/audit-log/${id}`}
          className="text-primary flex items-center gap-1 overflow-hidden font-mono text-xs hover:underline"
        >
          <span className="truncate">{id}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </Link>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 180,
    minSize: 150,
    maxSize: 200,
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      if (!date) return "-";

      return (
        <span className="text-muted-foreground block truncate text-sm">
          {new Date(date).toLocaleString()}
        </span>
      );
    },
    meta: {
      label: "Created At",
      filterVariant: "date",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "operation",
    header: "Operation",
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const operation = row.getValue("operation") as string;
      const icon = operationIcons[operation as keyof typeof operationIcons];
      const colorClass =
        operationColors[operation as keyof typeof operationColors] ||
        "bg-gray-100 text-gray-800";

      return (
        <div className="flex items-center gap-2 overflow-hidden">
          {icon}
          <Badge variant="secondary" className={colorClass}>
            {operation}
          </Badge>
        </div>
      );
    },
    meta: {
      label: "Operation",
      filterVariant: "text",
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "schema_name",
    header: "Schema",
    size: 150,
    minSize: 120,
    maxSize: 200,
    cell: ({ row }) => {
      const schema = row.getValue("schema_name") as string;
      return (
        <div className="flex items-center gap-2 overflow-hidden">
          <Database className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="truncate font-mono text-sm">{schema}</span>
        </div>
      );
    },
    meta: {
      label: "Schema",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "table_name",
    header: "Table",
    size: 150,
    minSize: 120,
    maxSize: 200,
    cell: ({ row }) => {
      const table = row.getValue("table_name") as string;
      return (
        <div className="flex items-center gap-2 overflow-hidden">
          <Table className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="truncate font-mono text-sm">{table}</span>
        </div>
      );
    },
    meta: {
      label: "Table",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "created_by",
    header: "User",
    size: 150,
    minSize: 120,
    maxSize: 200,
    cell: ({ row }) => {
      const user = row.original.created_by;
      const userName = user?.name || "Unknown";
      const userEmail = user?.email;

      if (!user) {
        return <span className="text-muted-foreground">System</span>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2 overflow-hidden">
              <User className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm">{userName}</span>
            </TooltipTrigger>
            {userEmail && (
              <TooltipContent>
                <p>{userEmail}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
    meta: {
      label: "User",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "user_type",
    header: "Type",
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => {
      const userType = row.getValue("user_type") as string;
      const isSystem = userType === "system";

      return (
        <div className="flex items-center gap-2 overflow-hidden">
          {isSystem ? (
            <Bot className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          ) : (
            <User className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          )}
          <span className="truncate text-sm capitalize">
            {userType.replace("_", " ")}
          </span>
        </div>
      );
    },
    meta: {
      label: "Type",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      if (!role) return "-";

      return (
        <div className="overflow-hidden">
          <Badge variant="outline" className="truncate font-mono">
            {role}
          </Badge>
        </div>
      );
    },
    meta: {
      label: "Role",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "changed_fields",
    header: "Changed Fields",
    size: 130,
    minSize: 100,
    maxSize: 180,
    cell: ({ row }) => {
      const fields = row.getValue("changed_fields") as string[];
      if (!fields || fields.length === 0) return "-";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">
                {fields.length} field{fields.length !== 1 ? "s" : ""}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="mb-1 font-semibold">Changed fields:</p>
                <p className="text-sm">{fields.join(", ")}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    meta: {
      label: "Changed Fields",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "is_error",
    header: "Status",
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => {
      const isError = row.getValue("is_error") as boolean;
      const errorMessage = row.original.error_message;

      if (isError) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Error
                </Badge>
              </TooltipTrigger>
              {errorMessage && (
                <TooltipContent>
                  <p className="max-w-xs">{errorMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-600 text-green-600"
        >
          <CheckCircle className="h-3 w-3" />
          Success
        </Badge>
      );
    },
  },
];

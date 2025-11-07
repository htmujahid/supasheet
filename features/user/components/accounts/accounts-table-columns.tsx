"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Account } from "../../lib/types";

export const getAccountsTableColumns = (): ColumnDef<Account>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const pictureUrl = row.original.picture_url;
      const name = row.getValue("name") as string;
      const email = row.getValue("email") as string | null;
      return (
        <Link href={`/home/user/accounts/${row.original.id}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-4">
              <AvatarImage src={pictureUrl ?? ""} alt="User avatar" />
              <AvatarFallback>
                {name?.charAt(0)?.toUpperCase() ||
                  email?.charAt(0)?.toUpperCase() ||
                  "?"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{name}</span>
          </div>
        </Link>
      );
    },
    meta: {
      label: "Name",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return (
        <Link href={`/home/user/accounts/${row.original.id}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate text-sm">{email}</span>
          </div>
        </Link>
      );
    },
    meta: {
      label: "Email",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string | null;
      return (
        <span className="text-muted-foreground block truncate text-sm">
          {date ? new Date(date).toLocaleString() : null}
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
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string | null;
      return (
        <span className="text-muted-foreground block truncate text-sm">
          {date ? new Date(date).toLocaleString() : null}
        </span>
      );
    },
    meta: {
      label: "Updated At",
      filterVariant: "date",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => {
      const createdBy = row.getValue("created_by") as string | null;
      return <span className="truncate font-mono text-sm">{createdBy}</span>;
    },
    meta: {
      label: "Created By",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    cell: ({ row }) => {
      const updatedBy = row.getValue("updated_by") as string | null;
      return <span className="truncate font-mono text-sm">{updatedBy}</span>;
    },
    meta: {
      label: "Updated By",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "public_data",
    header: "Public Data",
    cell: ({ row }) => {
      const publicData = row.getValue("public_data");
      if (
        !publicData ||
        (typeof publicData === "object" && Object.keys(publicData).length === 0)
      ) {
        return null;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">
                {typeof publicData === "object"
                  ? `${Object.keys(publicData).length} fields`
                  : "Data"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <pre className="text-xs">
                  {JSON.stringify(publicData, null, 2)}
                </pre>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Mail, User } from "lucide-react";

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
    accessorKey: "id",
    header: "ID",
    size: 320,
    minSize: 280,
    maxSize: 400,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Link
          href={`/home/user/accounts/${id}`}
          className="text-primary flex items-center gap-1 overflow-hidden font-mono text-xs hover:underline"
        >
          <span className="truncate">{id}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2 overflow-hidden">
          <User className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm">{name}</span>
        </div>
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
    size: 250,
    minSize: 200,
    maxSize: 300,
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return (
        <div className="flex items-center gap-2 overflow-hidden">
          <Mail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm">{email}</span>
        </div>
      );
    },
    meta: {
      label: "Email",
      filterVariant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "picture_url",
    header: "Picture",
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const pictureUrl = row.getValue("picture_url") as string | null;
      const name = row.getValue("name") as string;
      const email = row.getValue("email") as string | null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src={pictureUrl ?? ""} alt="User avatar" />
                <AvatarFallback>
                  {name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{pictureUrl}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
    size: 180,
    minSize: 150,
    maxSize: 200,
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
    size: 200,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => {
      const createdBy = row.getValue("created_by") as string | null;
      return (
        <span className="truncate font-mono text-sm">{createdBy}</span>
      );
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
    size: 200,
    minSize: 150,
    maxSize: 250,
    cell: ({ row }) => {
      const updatedBy = row.getValue("updated_by") as string | null;
      return (
        <span className="truncate font-mono text-sm">{updatedBy}</span>
      );
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
    size: 150,
    minSize: 120,
    maxSize: 200,
    cell: ({ row }) => {
      const publicData = row.getValue("public_data");
      if (!publicData || (typeof publicData === 'object' && Object.keys(publicData).length === 0)) {
        return null;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">
                {typeof publicData === 'object'
                  ? `${Object.keys(publicData).length} fields`
                  : 'Data'}
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

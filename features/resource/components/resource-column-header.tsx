"use client";

import { memo } from "react";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnSchema, TableSchema } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { cn } from "@/lib/utils";

import { getDataTypeIcon } from "./icons";

export const ResourceColumnHeader = memo(function ResourceColumnHeader<
  TData,
  TValue,
>({
  column,
  title,
  className,
  columnSchema,
  tableSchema,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger> & {
  column: Column<TData, TValue>;
  title: string;
  tableSchema: TableSchema | null;
  columnSchema: ColumnSchema;
}) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div className={cn("flex items-center gap-2 truncate", className)}>
        {getDataTypeIcon(tableSchema, columnSchema)}
        {formatTitle(title)}
      </div>
    );
  }

  return (
    <div className="relative truncate">
      <div className="flex items-center gap-2">
        {getDataTypeIcon(tableSchema, columnSchema)}
        {formatTitle(title)}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "bg-accent hover:bg-background/50 [&_svg]:text-muted-foreground focus:ring-ring absolute top-1/2 right-0.25 hidden -translate-y-1/2 transform rounded px-0.25 py-0.25 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0",
            className,
          )}
          {...props}
        >
          {column.getCanSort() &&
            (column.getIsSorted() === "desc" ? (
              <ChevronDown />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp />
            ) : (
              <ChevronsUpDown />
            ))}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-28">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "asc"}
                onClick={() => column.toggleSorting(false)}
              >
                <ChevronUp />
                Asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "desc"}
                onClick={() => column.toggleSorting(true)}
              >
                <ChevronDown />
                Desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground pl-2"
                  onClick={() => column.clearSorting()}
                >
                  <X />
                  Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={!column.getIsVisible()}
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff />
              Hide
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}) as <TData, TValue>(
  props: React.ComponentProps<typeof DropdownMenuTrigger> & {
    column: Column<TData, TValue>;
    title: string;
    tableSchema: TableSchema | null;
    columnSchema: ColumnSchema;
  },
) => React.ReactElement;

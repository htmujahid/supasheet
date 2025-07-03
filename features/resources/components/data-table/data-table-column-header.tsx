"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  FingerprintIcon,
  KeyIcon,
  LinkIcon,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  columnSchema,
  tableSchema,
  ...props
}: DataTableColumnHeaderProps<TData, TValue> & {
  tableSchema: Tables<"_pg_meta_tables"> | null;
  columnSchema: Tables<"_pg_meta_columns">;
}) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div className={cn("flex items-center gap-2 truncate", className)}>
        {getColumnConstraintIcon(tableSchema, columnSchema)}
        {title}
        {getColumnTypeIcon(columnSchema)}
      </div>
    );
  }

  return (
    <div className="relative truncate">
      <div className="flex items-center gap-2">
        {getColumnConstraintIcon(tableSchema, columnSchema)}
        {title}
        {getColumnTypeIcon(columnSchema)}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "bg-accent hover:bg-background/50 rounded px-0.25 py-0.25 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground absolute top-1/2 transform -translate-y-1/2 right-0.25 focus:ring-1 focus:outline-none focus:ring-ring",
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
}

function getColumnConstraintIcon(
  tableSchema: Tables<"_pg_meta_tables"> | null,
  columnSchema: Tables<"_pg_meta_columns">,
) {
  const primaryKeys = (tableSchema?.primary_keys as { name: string }[]) ?? [];
  const foreignKeys =
    (tableSchema?.relationships as { source_column_name: string }[]) ?? [];

  if (primaryKeys.some((key) => key.name === columnSchema.name)) {
    return <KeyIcon className="text-muted-foreground size-3" />;
  }

  if (columnSchema.is_unique) {
    return <FingerprintIcon className="text-muted-foreground size-3" />;
  }

  if (columnSchema.is_identity) {
    return <FingerprintIcon className="text-muted-foreground size-3" />;
  }

  if (foreignKeys.some((key) => key.source_column_name === columnSchema.name)) {
    return <LinkIcon className="text-muted-foreground size-3" />;
  }
}

function getColumnTypeIcon(columnSchema: Tables<"_pg_meta_columns">) {
  switch (columnSchema.actual_type) {
    case "task_code":
      return <code className="text-muted-foreground font-mono text-xs">T</code>;
  }

  switch (columnSchema.data_type) {
    case "character":
    case "character varying":
    case "text":
      return (
        <code className="text-muted-foreground font-mono text-xs">Aa</code>
      );
    case "bigint":
    case "bigserial":
    case "integer":
    case "numeric":
    case "smallint":
    case "smallserial":
    case "serial":
      return (
        <code className="text-muted-foreground font-mono text-xs">123</code>
      );
    case "bit":
    case "bit varying":
      return (
        <code className="text-muted-foreground font-mono text-xs">01</code>
      );
    case "box":
    case "point":
    case "line":
    case "lseg":
    case "polygon":
    case "path":
      return (
        <code className="text-muted-foreground font-mono text-xs">x,y</code>
      );
    case "macaddr":
    case "macaddr8":
      return (
        <code className="text-muted-foreground font-mono text-xs">mac</code>
      );
    case "money":
      return (
        <code className="text-muted-foreground font-mono text-xs">money</code>
      );
    case "bytea":
      return (
        <code className="text-muted-foreground font-mono text-xs">\x</code>
      );
    case "cidr":
    case "inet":
      return (
        <code className="text-muted-foreground font-mono text-xs">ipv</code>
      );
    case "circle":
      return (
        <code className="text-muted-foreground font-mono text-xs">x,y,r</code>
      );
    case "date":
      return (
        <code className="text-muted-foreground font-mono text-xs">date</code>
      );
    case "time with time zone":
    case "time without time zone":
    case "time":
      return (
        <code className="text-muted-foreground font-mono text-xs">time</code>
      );
    case "interval":
    case "json":
    case "jsonb":
      return (
        <code className="text-muted-foreground font-mono text-xs">json</code>
      );
    case "double precision":
    case "real":
      return (
        <code className="text-muted-foreground font-mono text-xs">12.3</code>
      );
    case "boolean":
      return (
        <code className="text-muted-foreground font-mono text-xs">bool</code>
      );
    case "USER-DEFINED":
      return (
        <code className="text-muted-foreground font-mono text-xs">enum</code>
      );
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "timestamp":
      return (
        <code className="text-muted-foreground font-mono text-xs">
          timestamp
        </code>
      );
    case "tsquery":
      return (
        <code className="text-muted-foreground font-mono text-xs">tsq</code>
      );
    case "tsvector":
      return (
        <code className="text-muted-foreground font-mono text-xs">tsv</code>
      );
    case "uuid":
      return (
        <code className="text-muted-foreground font-mono text-xs">UID</code>
      );
    case "xml":
      return (
        <code className="text-muted-foreground font-mono text-xs">xml</code>
      );
  }
}

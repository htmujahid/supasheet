"use client";

import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {children}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

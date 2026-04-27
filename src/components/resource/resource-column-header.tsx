import { memo } from "react"

import type { Column } from "@tanstack/react-table"

import { ChevronDown, ChevronUp, ChevronsUpDown, EyeOff, X } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import { cn } from "#/lib/utils"

import { getDataTypeIcon } from "./icons"

export const ResourceColumnHeader = memo(function <TData, TValue>({
  column,
  title,
  className,
  columnSchema,
  tableSchema,
  isSorted,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
  tableSchema: TableSchema | null
  columnSchema: ColumnSchema
  isSorted: false | "asc" | "desc"
}) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div className={cn("flex items-center gap-2 truncate", className)}>
        {getDataTypeIcon(tableSchema, columnSchema)}
        {formatTitle(title)}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 truncate [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className
        )}
      >
        {getDataTypeIcon(tableSchema, columnSchema)}
        <span className="truncate">{formatTitle(title)}</span>
        {column.getCanSort() &&
          (isSorted === "desc" ? (
            <ChevronDown />
          ) : isSorted === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              checked={isSorted === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isSorted === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Desc
            </DropdownMenuCheckboxItem>
            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}) as <TData, TValue>(props: {
  column: Column<TData, TValue>
  title: string
  className?: string
  tableSchema: TableSchema | null
  columnSchema: ColumnSchema
  isSorted: false | "asc" | "desc"
}) => React.ReactElement

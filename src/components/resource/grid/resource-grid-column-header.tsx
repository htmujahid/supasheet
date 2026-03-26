import { memo } from "react"

import type { Column } from "@tanstack/react-table"

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  Pin,
  PinOff,
  X,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import { cn } from "#/lib/utils"

import { getDataTypeIcon } from "../icons"

const checkboxItemClassName =
  "relative ltr:pr-8 ltr:pl-2 rtl:pr-2 rtl:pl-8 [&>span:first-child]:ltr:right-2 [&>span:first-child]:ltr:left-auto [&>span:first-child]:rtl:right-auto [&>span:first-child]:rtl:left-2 [&_svg]:text-muted-foreground"

export const ResourceGridColumnHeader = memo(function <TData, TValue>({
  column,
  title,
  className,
  columnSchema,
  tableSchema,
  pinnedState,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
  tableSchema: TableSchema | null
  columnSchema: ColumnSchema
  pinnedState?: false | "left" | "right"
}) {
  const isPinnedLeft = (pinnedState ?? column.getIsPinned()) === "left"
  const isPinnedRight = (pinnedState ?? column.getIsPinned()) === "right"

  if (!column.getCanSort() && !column.getCanHide() && !column.getCanPin()) {
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
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={0} className="w-60">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className={checkboxItemClassName}
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Sort asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className={checkboxItemClassName}
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Sort desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <X />
                Remove sort
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanPin() && (
          <>
            {column.getCanSort() && <DropdownMenuSeparator />}
            {isPinnedLeft ? (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={() => column.pin(false)}
              >
                <PinOff />
                Unpin from left
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={() => column.pin("left")}
              >
                <Pin />
                Pin to left
              </DropdownMenuItem>
            )}
            {isPinnedRight ? (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={() => column.pin(false)}
              >
                <PinOff />
                Unpin from right
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={() => column.pin("right")}
              >
                <Pin />
                Pin to right
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="[&_svg]:text-muted-foreground"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff />
              Hide column
            </DropdownMenuItem>
          </>
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
  pinnedState?: false | "left" | "right"
}) => React.ReactElement

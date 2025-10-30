"use client";

import * as React from "react";

import type {
  ColumnSort,
  Header,
  SortDirection,
  SortingState,
  Table,
} from "@tanstack/react-table";
import {
  BaselineIcon,
  CalendarIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeOffIcon,
  HashIcon,
  ListChecksIcon,
  ListIcon,
  PinIcon,
  PinOffIcon,
  TextInitialIcon,
  XIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTitle } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataGridColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  header: Header<TData, TValue>;
  table: Table<TData>;
}

export function DataGridColumnHeader<TData, TValue>({
  header,
  table,
  className,
  onPointerDown,
  ...props
}: DataGridColumnHeaderProps<TData, TValue>) {
  const column = header.column;
  const label = column.columnDef.meta?.label
    ? column.columnDef.meta.label
    : typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : column.id;

  const isAnyColumnResizing =
    table.getState().columnSizingInfo.isResizingColumn;

  const cellVariant = column.columnDef.meta;

  const pinnedPosition = column.getIsPinned();
  const isPinnedLeft = pinnedPosition === "left";
  const isPinnedRight = pinnedPosition === "right";

  const onSortingChange = React.useCallback(
    (direction: SortDirection) => {
      table.setSorting((prev: SortingState) => {
        const existingSortIndex = prev.findIndex(
          (sort) => sort.id === column.id,
        );
        const newSort: ColumnSort = {
          id: column.id,
          desc: direction === "desc",
        };

        if (existingSortIndex >= 0) {
          const updated = [...prev];
          updated[existingSortIndex] = newSort;
          return updated;
        } else {
          return [...prev, newSort];
        }
      });
    },
    [column.id, table],
  );

  const onSortRemove = React.useCallback(() => {
    table.setSorting((prev: SortingState) =>
      prev.filter((sort) => sort.id !== column.id),
    );
  }, [column.id, table]);

  const onLeftPin = React.useCallback(() => {
    column.pin("left");
  }, [column]);

  const onRightPin = React.useCallback(() => {
    column.pin("right");
  }, [column]);

  const onUnpin = React.useCallback(() => {
    column.pin(false);
  }, [column]);

  const onTriggerPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;

      if (event.button !== 0) {
        return;
      }
      table.options.meta?.onColumnClick?.(column.id);
    },
    [table.options.meta, column.id, onPointerDown],
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "hover:bg-accent/40 data-[state=open]:bg-accent/40 flex size-full items-center justify-between gap-2 p-2 text-sm [&_svg]:size-4",
            isAnyColumnResizing && "pointer-events-none",
            className,
          )}
          onPointerDown={onTriggerPointerDown}
          {...props}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {cellVariant && (
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{cellVariant.icon}</TooltipTrigger>
                <TooltipContent side="top">
                  <p>{cellVariant.variant}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <span className="truncate">{formatTitle(label)}</span>
          </div>
          <ChevronDownIcon className="text-muted-foreground shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={0} className="w-60">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "asc"}
                onClick={() => onSortingChange("asc")}
              >
                <ChevronUpIcon />
                Sort asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={column.getIsSorted() === "desc"}
                onClick={() => onSortingChange("desc")}
              >
                <ChevronDownIcon />
                Sort desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem onClick={onSortRemove}>
                  <XIcon />
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
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from left
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onLeftPin}
                >
                  <PinIcon />
                  Pin to left
                </DropdownMenuItem>
              )}
              {isPinnedRight ? (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from right
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onRightPin}
                >
                  <PinIcon />
                  Pin to right
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                checked={!column.getIsVisible()}
                onClick={() => column.toggleVisibility(false)}
              >
                <EyeOffIcon />
                Hide column
              </DropdownMenuCheckboxItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {header.column.getCanResize() && (
        <DataGridColumnResizer header={header} table={table} label={label} />
      )}
    </>
  );
}

const DataGridColumnResizer = React.memo(
  DataGridColumnResizerImpl,
  (prev, next) => {
    const prevColumn = prev.header.column;
    const nextColumn = next.header.column;

    if (
      prevColumn.getIsResizing() !== nextColumn.getIsResizing() ||
      prevColumn.getSize() !== nextColumn.getSize()
    ) {
      return false;
    }

    if (prev.label !== next.label) return false;

    return true;
  },
) as typeof DataGridColumnResizerImpl;

interface DataGridColumnResizerProps<TData, TValue>
  extends DataGridColumnHeaderProps<TData, TValue> {
  label: string;
}

function DataGridColumnResizerImpl<TData, TValue>({
  header,
  table,
  label,
}: DataGridColumnResizerProps<TData, TValue>) {
  const defaultColumnDef = table._getDefaultColumnDef();

  const onDoubleClick = React.useCallback(() => {
    header.column.resetSize();
  }, [header.column]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      aria-valuenow={header.column.getSize()}
      aria-valuemin={defaultColumnDef.minSize}
      aria-valuemax={defaultColumnDef.maxSize}
      tabIndex={0}
      className={cn(
        "bg-border hover:bg-primary focus:bg-primary absolute top-0 -right-px z-50 h-full w-0.5 cursor-ew-resize touch-none transition-opacity select-none after:absolute after:inset-y-0 after:left-1/2 after:h-full after:w-[18px] after:-translate-x-1/2 after:content-[''] focus:outline-none",
        header.column.getIsResizing()
          ? "bg-primary"
          : "opacity-0 hover:opacity-100",
      )}
      onDoubleClick={onDoubleClick}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
}

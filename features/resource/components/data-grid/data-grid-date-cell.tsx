"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

import { updateResourceDataAction } from "../../lib/actions";
import { DataGridCellWrapper } from "./data-grid-cell-wrapper";

interface CellVariantProps<TData> {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
}

function formatDateForDisplay(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function DataGridDateCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = table.options.meta;

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "");
  }

  const selectedDate = value ? new Date(value) : undefined;

  const onDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const formattedDate = date.toISOString().split("T")[0] ?? "";
      setValue(formattedDate);
      meta?.onDataUpdate?.({ rowIndex, columnId, value: formattedDate });
      setOpen(false);
      meta?.onCellEditingStop?.();
    },
    [meta, rowIndex, columnId],
  );

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen && isEditing) {
        meta?.onCellEditingStop?.();
      }
    },
    [isEditing, meta],
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        if (event.key === "Escape") {
          event.preventDefault();
          setValue(initialValue);
          setOpen(false);
        } else if (event.key === "Tab") {
          event.preventDefault();
          setOpen(false);
          meta?.onCellEditingStop?.({
            direction: event.shiftKey ? "left" : "right",
          });
        }
      }
    },
    [isEditing, initialValue, meta],
  );

  useEffect(() => {
    if (isEditing) {
      setOpen(true);
    } else {
      setOpen(false);
      if (initialValue !== value) {
        const row = cell.row.original;
        const cellOpts = cell.column.columnDef.meta;

        const resourceIds =
          cellOpts?.primaryKeys?.reduce(
            (acc, key) => {
              acc[key.name] = row[key.name as keyof TData];
              return acc;
            },
            {} as Record<string, unknown>,
          ) ?? {};

        updateResourceDataAction({
          schema: cellOpts?.schema as never,
          resourceName: cellOpts?.table as never,
          resourceIds,
          data: { [columnId]: value },
        }).catch((error) => {
          toast.error(error.message);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    if (
      isFocused &&
      !isEditing &&
      !meta?.searchOpen &&
      !meta?.isScrolling &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [isFocused, isEditing, meta?.searchOpen, meta?.isScrolling]);

  return (
    <DataGridCellWrapper
      ref={containerRef}
      cell={cell}
      table={table}
      rowIndex={rowIndex}
      columnId={columnId}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      onKeyDown={onWrapperKeyDown}
    >
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverAnchor asChild>
          <span data-slot="grid-cell-content">
            {formatDateForDisplay(value)}
          </span>
        </PopoverAnchor>
        {isEditing && (
          <PopoverContent
            data-grid-cell-editor=""
            align="start"
            sideOffset={10}
            className="w-auto p-0"
          >
            <Calendar
              autoFocus
              captionLayout="dropdown"
              mode="single"
              className="rounded-md border shadow-sm"
              defaultMonth={selectedDate ?? new Date()}
              selected={selectedDate}
              onSelect={onDateSelect}
            />
          </PopoverContent>
        )}
      </Popover>
    </DataGridCellWrapper>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { updateResourceDataAction } from "../../lib/actions";
import { EnumCell } from "../cells/enum-cell";
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

export function DataGridEnumCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = table.options.meta;
  const cellOpts = cell.column.columnDef.meta;
  const options =
    cellOpts?.variant === "select" ? (cellOpts.options ?? []) : [];

  const onValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
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
        data: { [columnId]: newValue },
      }).catch((error) => {
        toast.error(error.message);
      });
      meta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
      meta?.onCellEditingStop?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, rowIndex, columnId],
  );

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        meta?.onCellEditingStop?.();
      }
    },
    [meta],
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        if (event.key === "Escape") {
          event.preventDefault();
          setValue(initialValue);
          setOpen(false);
          meta?.onCellEditingStop?.();
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
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && !open) {
      setOpen(true);
    }
    if (
      isFocused &&
      !isEditing &&
      !meta?.searchOpen &&
      !meta?.isScrolling &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [isFocused, isEditing, open, meta?.searchOpen, meta?.isScrolling]);

  const displayLabel =
    options.find((opt) => opt.value === value)?.label ?? value;

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
      {isEditing ? (
        <Select
          value={value}
          onValueChange={onValueChange}
          open={open}
          onOpenChange={onOpenChange}
        >
          <SelectTrigger
            size="sm"
            className="size-full items-start border-none p-0 shadow-none focus-visible:ring-0 dark:bg-transparent [&_svg]:hidden"
          >
            <EnumCell value={displayLabel} />
          </SelectTrigger>
          <SelectContent
            data-grid-cell-editor=""
            align="start"
            alignOffset={-8}
            sideOffset={-8}
            className="min-w-[calc(var(--radix-select-trigger-width)+16px)]"
          >
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <EnumCell value={displayLabel} />
      )}
    </DataGridCellWrapper>
  );
}

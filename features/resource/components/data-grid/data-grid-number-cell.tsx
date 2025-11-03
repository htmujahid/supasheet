"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

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

export function DataGridNumberCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as number;
  const [value, setValue] = useState(String(initialValue ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = table.options.meta;

  const onBlur = useCallback(() => {
    const numValue = value === "" ? null : Number(value);
    if (numValue !== initialValue) {
      meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
    }
    meta?.onCellEditingStop?.();
  }, [meta, rowIndex, columnId, initialValue, value]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        if (event.key === "Enter") {
          event.preventDefault();
          const numValue = value === "" ? null : Number(value);
          if (numValue !== initialValue) {
            meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
          }
          meta?.onCellEditingStop?.({ moveToNextRow: true });
        } else if (event.key === "Tab") {
          event.preventDefault();
          const numValue = value === "" ? null : Number(value);
          if (numValue !== initialValue) {
            meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
          }
          meta?.onCellEditingStop?.({
            direction: event.shiftKey ? "left" : "right",
          });
        } else if (event.key === "Escape") {
          event.preventDefault();
          setValue(String(initialValue ?? ""));
          inputRef.current?.blur();
        }
      } else if (isFocused) {
        // Handle Backspace to start editing with empty value
        if (event.key === "Backspace") {
          setValue("");
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          // Handle typing to pre-fill the value when editing starts
          setValue(event.key);
        }
      }
    },
    [isEditing, isFocused, initialValue, meta, rowIndex, columnId, value],
  );

  useEffect(() => {
    setValue(String(initialValue ?? ""));
  }, [initialValue]);

  useEffect(() => {
    if (!isEditing && initialValue !== Number(value)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          className="w-full border-none bg-transparent p-0 outline-none"
        />
      ) : (
        <span data-slot="grid-cell-content">{value}</span>
      )}
    </DataGridCellWrapper>
  );
}

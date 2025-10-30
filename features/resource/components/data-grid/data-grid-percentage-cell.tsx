"use client";

import * as React from "react";

import type { Cell, Table } from "@tanstack/react-table";

import { Progress } from "@/components/ui/progress";

import { DataGridCellWrapper } from "./data-grid-cell-wrapper";
import { PercentageCell } from "../cells/percentage-cell";
import { updateResourceDataAction } from "../../lib/actions";
import { toast } from "sonner";

interface CellVariantProps<TData> {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
}

export function DataGridPercentageCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as number;
  const [value, setValue] = React.useState(String(initialValue ?? "0"));
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const meta = table.options.meta;

  const onBlur = React.useCallback(() => {
    const numValue = value === "" ? 0 : Number(value);
    if (numValue !== initialValue) {
      meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
    }
    meta?.onCellEditingStop?.();
  }, [meta, rowIndex, columnId, initialValue, value]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    [],
  );

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        if (event.key === "Enter") {
          event.preventDefault();
          const numValue = value === "" ? 0 : Number(value);
          if (numValue !== initialValue) {
            meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
          }
          meta?.onCellEditingStop?.({ moveToNextRow: true });
        } else if (event.key === "Tab") {
          event.preventDefault();
          const numValue = value === "" ? 0 : Number(value);
          if (numValue !== initialValue) {
            meta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
          }
          meta?.onCellEditingStop?.({
            direction: event.shiftKey ? "left" : "right",
          });
        } else if (event.key === "Escape") {
          event.preventDefault();
          setValue(String(initialValue ?? "0"));
          inputRef.current?.blur();
        }
      }
    },
    [isEditing, initialValue, meta, rowIndex, columnId, value],
  );

  React.useEffect(() => {
    setValue(String(initialValue ?? "0"));
  }, [initialValue]);


  React.useEffect(() => {
    if (!isEditing && initialValue !== Number(value)) {

      const row = cell.row.original;
      const cellOpts = cell.column.columnDef.meta;

      const resourceIds = cellOpts?.primaryKeys?.reduce(
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

  React.useEffect(() => {
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

  const numericValue = Number(value);

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
          min="0"
          max="100"
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          className="w-full border-none bg-transparent p-0 outline-none"
        />
      ) : (
        <PercentageCell value={numericValue} />
      )}
    </DataGridCellWrapper>
  );
}

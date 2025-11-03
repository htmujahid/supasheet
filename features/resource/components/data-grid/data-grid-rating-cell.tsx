"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { Rating, RatingItem } from "@/components/ui/rating";

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

export function DataGridRatingCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as number;
  const [value, setValue] = useState(initialValue ?? 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = table.options.meta;

  const onValueChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      meta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
    },
    [meta, rowIndex, columnId],
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFocused) {
        if (event.key >= "0" && event.key <= "5") {
          event.preventDefault();
          const numValue = Number(event.key);
          onValueChange(numValue);
        }
      }
    },
    [isFocused, onValueChange],
  );

  useEffect(() => {
    setValue(initialValue ?? 0);
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
    if (
      isFocused &&
      !meta?.searchOpen &&
      !meta?.isScrolling &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [isFocused, meta?.searchOpen, meta?.isScrolling]);

  return (
    <DataGridCellWrapper
      ref={containerRef}
      cell={cell}
      table={table}
      rowIndex={rowIndex}
      columnId={columnId}
      isEditing={false}
      isFocused={isFocused}
      isSelected={isSelected}
      onKeyDown={onWrapperKeyDown}
    >
      <Rating value={value} onValueChange={onValueChange} step={0.5}>
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i} />
        ))}
      </Rating>
    </DataGridCellWrapper>
  );
}

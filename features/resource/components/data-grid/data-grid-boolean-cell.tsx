"use client";

import * as React from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";

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

export function DataGridCheckboxCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as boolean;
  const [value, setValue] = React.useState(Boolean(initialValue));
  const containerRef = React.useRef<HTMLDivElement>(null);
  const meta = table.options.meta;

  const onCheckedChange = React.useCallback(
    (checked: boolean) => {
      setValue(checked);
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
        data: { [columnId]: checked },
      }).catch((error) => {
        toast.error(error.message);
      });
      meta?.onDataUpdate?.({ rowIndex, columnId, value: checked });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, rowIndex, columnId],
  );

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFocused && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        event.stopPropagation();
        onCheckedChange(!value);
      }
    },
    [isFocused, value, onCheckedChange],
  );

  React.useEffect(() => {
    setValue(Boolean(initialValue));
  }, [initialValue]);

  React.useEffect(() => {
    if (
      isFocused &&
      !meta?.searchOpen &&
      !meta?.isScrolling &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [isFocused, meta?.searchOpen, meta?.isScrolling]);

  const onWrapperClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (isFocused) {
        event.preventDefault();
        event.stopPropagation();
        onCheckedChange(!value);
      }
    },
    [isFocused, value, onCheckedChange],
  );

  const onCheckboxClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const onCheckboxMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const onCheckboxDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    },
    [],
  );

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
      onClick={onWrapperClick}
      onKeyDown={onWrapperKeyDown}
      className="flex size-full justify-center"
    >
      <Checkbox
        checked={value}
        onCheckedChange={onCheckedChange}
        onClick={onCheckboxClick}
        onMouseDown={onCheckboxMouseDown}
        onDoubleClick={onCheckboxDoubleClick}
        className="border-primary"
      />
    </DataGridCellWrapper>
  );
}

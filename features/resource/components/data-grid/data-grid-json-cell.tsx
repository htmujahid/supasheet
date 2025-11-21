"use client";

import { useRef } from "react";

import type { Cell, Table } from "@tanstack/react-table";

import { DataGridCellWrapper } from "./data-grid-cell-wrapper";

type CellVariantProps<TData> = {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

export function DataGridJsonCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as string;
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="flex size-full items-center justify-start"
    >
      <pre className="truncate">
        {initialValue ? JSON.stringify(initialValue, null, 2) : ""}
      </pre>
    </DataGridCellWrapper>
  );
}

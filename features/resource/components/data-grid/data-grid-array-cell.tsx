"use client";

import { useRef } from "react";

import type { Cell, Table } from "@tanstack/react-table";

import { ArrayCell } from "../cells/array-cell";
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

export function DataGridArrayCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const rawCellValue = cell.getValue();

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
      className="overflow-hidden"
    >
      <ArrayCell value={rawCellValue as unknown[]} />
    </DataGridCellWrapper>
  );
}

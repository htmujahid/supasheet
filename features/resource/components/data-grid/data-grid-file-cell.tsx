"use client";

import { useRef } from "react";

import type { Cell, Table } from "@tanstack/react-table";

import { FileCell } from "../cells/file-cell";
import { DataGridCellWrapper } from "./data-grid-cell-wrapper";
import { FileObject } from "../fields/types";

type CellVariantProps<TData> = {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

export function DataGridFileCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as FileObject[];
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
    >
      <FileCell value={initialValue} />
    </DataGridCellWrapper>
  );
}

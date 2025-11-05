"use client";

import { useRef } from "react";

import Link from "next/link";

import type { Cell, Table } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";

import { Relationship } from "@/lib/database-meta.types";

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

export function DataGridForeignKeyCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isEditing,
  isFocused,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const cellOpts = cell.column.columnDef.meta;

  const relationship = cellOpts?.relationship as Relationship;

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
      className="relative truncate pl-7"
    >
      <Link
        href={`/home/${relationship.target_table_schema}/resource/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${initialValue}","variant":"text","operator":"eq","filterId":"0QdV0twS"}]`}
        target="_blank"
        className="absolute top-2 left-1 rounded border p-0.5"
      >
        <ArrowUpRightIcon className="size-3" />
      </Link>
      <span className="whitespace-nowrap">{initialValue}</span>
    </DataGridCellWrapper>
  );
}

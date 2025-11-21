"use client";

import { useRef } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function DataGridAvatarCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as FileObject | null;
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
      <Avatar className="size-5.5">
        <AvatarImage
          alt="Avatar"
          src={initialValue ? initialValue.url : undefined}
        />
        <AvatarFallback>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    </DataGridCellWrapper>
  );
}

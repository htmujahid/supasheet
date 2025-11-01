"use client";

import type { Cell, Table } from "@tanstack/react-table";

import { DataGridArrayCell } from "./data-grid-array-cell";
import { DataGridAvatarCell } from "./data-grid-avatar-cell";
import { DataGridCheckboxCell } from "./data-grid-boolean-cell";
import { DataGridDateCell } from "./data-grid-date-cell";
import { DataGridDateTimeCell } from "./data-grid-datetime-cell";
import { DataGridDurationCell } from "./data-grid-duration-cell";
import { DataGridEnumCell } from "./data-grid-enum-cell";
import { DataGridFileCell } from "./data-grid-file-cell";
import { DataGridForeignKeyCell } from "./data-grid-foreign-key-cell";
import { DataGridJsonCell } from "./data-grid-json-cell";
import { DataGridLongTextCell } from "./data-grid-long-text-cell";
import { DataGridMoneyCell } from "./data-grid-money-cell";
import { DataGridNumberCell } from "./data-grid-number-cell";
import { DataGridPercentageCell } from "./data-grid-percentage-cell";
import { DataGridRatingCell } from "./data-grid-rating-cell";
import { DataGridTextCell } from "./data-grid-text-cell";
import { DataGridTimeCell } from "./data-grid-time-cell";
import { DataGridUuidCell } from "./data-grid-uuid-cell";

interface DataGridCellProps<TData> {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
}

export function DataGridCell<TData>({ cell, table }: DataGridCellProps<TData>) {
  const meta = table.options.meta;
  const originalRowIndex = cell.row.index;

  const rows = table.getRowModel().rows;
  const displayRowIndex = rows.findIndex(
    (row) => row.original === cell.row.original,
  );
  const rowIndex = displayRowIndex >= 0 ? displayRowIndex : originalRowIndex;
  const columnId = cell.column.id;

  const isFocused =
    meta?.focusedCell?.rowIndex === rowIndex &&
    meta?.focusedCell?.columnId === columnId;
  const isEditing =
    meta?.editingCell?.rowIndex === rowIndex &&
    meta?.editingCell?.columnId === columnId;
  const isSelected = meta?.getIsCellSelected?.(rowIndex, columnId) ?? false;

  const cellOpts = cell.column.columnDef.meta;
  const variant = cellOpts?.variant ?? "text";

  // Common props for all cells
  const cellProps = {
    cell,
    table,
    rowIndex,
    columnId,
    isEditing: isEditing && !cellOpts?.isPrimaryKey && !cellOpts?.isMetadata,
    isFocused,
    isSelected,
  };

  if (cellOpts?.relationship) {
    return <DataGridForeignKeyCell {...cellProps} />;
  }

  // Handle special formats first
  if (variant === "avatar") {
    return <DataGridAvatarCell {...cellProps} />;
  }

  if (variant === "file") {
    return <DataGridFileCell {...cellProps} />;
  }

  // Handle array types
  if (cellOpts?.isArray) {
    return <DataGridArrayCell {...cellProps} />;
  }

  // Handle all variants
  switch (variant) {
    case "text":
    case "email":
    case "url":
    case "tel":
    case "color":
      return <DataGridTextCell {...cellProps} />;

    case "long_text":
    case "rich_text":
      return <DataGridLongTextCell {...cellProps} />;

    case "number":
      return <DataGridNumberCell {...cellProps} />;

    case "money":
      return <DataGridMoneyCell {...cellProps} />;

    case "percentage":
      return <DataGridPercentageCell {...cellProps} />;

    case "boolean":
      return <DataGridCheckboxCell {...cellProps} />;

    case "date":
      return <DataGridDateCell {...cellProps} />;

    case "datetime":
      return <DataGridDateTimeCell {...cellProps} />;

    case "time":
      return <DataGridTimeCell {...cellProps} />;

    case "duration":
      return <DataGridDurationCell {...cellProps} />;

    case "select":
      return <DataGridEnumCell {...cellProps} />;

    case "rating":
      return <DataGridRatingCell {...cellProps} />;

    case "uuid":
      return <DataGridUuidCell {...cellProps} />;

    case "json":
      return <DataGridJsonCell {...cellProps} />;

    default:
      return <DataGridTextCell {...cellProps} />;
  }
}

"use client";

import { memo, type ComponentType } from "react";

import type { DataGridCellProps } from "../../lib/types/data-grid";
import { DataGridArrayCell } from "./cells/data-grid-array-cell";
import { DataGridAvatarCell } from "./cells/data-grid-avatar-cell";
import { DataGridBooleanCell } from "./cells/data-grid-boolean-cell";
import { DataGridColorCell } from "./cells/data-grid-color-cell";
import { DataGridDateCell } from "./cells/data-grid-date-cell";
import { DataGridDateTimeCell } from "./cells/data-grid-datetime-cell";
import { DataGridDurationCell } from "./cells/data-grid-duration-cell";
import { DataGridFileCell } from "./cells/data-grid-file-cell";
import { DataGridForeignKeyCell } from "./cells/data-grid-foreign-key-cell";
import { DataGridJsonCell } from "./cells/data-grid-json-cell";
import { DataGridLongTextCell } from "./cells/data-grid-long-text-cell";
import { DataGridMoneyCell } from "./cells/data-grid-money-cell";
import { DataGridNumberCell } from "./cells/data-grid-number-cell";
import { DataGridPercentageCell } from "./cells/data-grid-percentage-cell";
import { DataGridRatingCell } from "./cells/data-grid-rating-cell";
import { DataGridSelectCell } from "./cells/data-grid-select-cell";
import { DataGridTextCell } from "./cells/data-grid-text-cell";
import { DataGridTimeCell } from "./cells/data-grid-time-cell";
import { DataGridUrlCell } from "./cells/data-grid-url-cell";

export const DataGridCell = memo(DataGridCellImpl, (prev, next) => {
  // Fast path: check stable primitive props first
  if (prev.isFocused !== next.isFocused) return false;
  if (prev.isEditing !== next.isEditing) return false;
  if (prev.isSelected !== next.isSelected) return false;
  if (prev.isSearchMatch !== next.isSearchMatch) return false;
  if (prev.isActiveSearchMatch !== next.isActiveSearchMatch) return false;
  if (prev.readOnly !== next.readOnly) return false;
  if (prev.rowIndex !== next.rowIndex) return false;
  if (prev.columnId !== next.columnId) return false;
  if (prev.rowHeight !== next.rowHeight) return false;

  // Check cell value using row.original instead of getValue() for stability
  // getValue() is unstable and recreates on every render, breaking memoization
  const prevValue = (prev.cell.row.original as Record<string, unknown>)[
    prev.columnId
  ];
  const nextValue = (next.cell.row.original as Record<string, unknown>)[
    next.columnId
  ];
  if (prevValue !== nextValue) {
    return false;
  }

  // Check cell/row identity
  if (prev.cell.row.id !== next.cell.row.id) return false;

  return true;
}) as typeof DataGridCellImpl;

function DataGridCellImpl<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
  rowHeight,
}: DataGridCellProps<TData>) {
  const cellOpts = cell.column.columnDef.meta;
  const variant = cellOpts?.variant ?? "text";
  const disabled = (cellOpts?.disabled || cellOpts?.isPrimaryKey) ?? false;
  const relationship = cellOpts?.relationship;
  const isArray = cellOpts?.isArray ?? false;

  let Comp: ComponentType<DataGridCellProps<TData>>;

  // Handle foreign key cells (cells with relationships)
  if (relationship) {
    Comp = DataGridForeignKeyCell;
  } else if (isArray) {
    // Handle array cells
    Comp = DataGridArrayCell;
  } else
    switch (variant) {
      case "text":
      case "uuid":
      case "email":
      case "tel":
        Comp = DataGridTextCell;
        break;
      case "rich_text":
      case "long_text":
        Comp = DataGridLongTextCell;
        break;
      case "number":
        Comp = DataGridNumberCell;
        break;
      case "url":
        Comp = DataGridUrlCell;
        break;
      case "boolean":
        Comp = DataGridBooleanCell;
        break;
      case "select":
        Comp = DataGridSelectCell;
        break;
      case "date":
        Comp = DataGridDateCell;
        break;
      case "datetime":
        Comp = DataGridDateTimeCell;
        break;
      case "time":
        Comp = DataGridTimeCell;
        break;
      case "file":
        Comp = DataGridFileCell;
        break;
      case "avatar":
        Comp = DataGridAvatarCell;
        break;
      case "rating":
        Comp = DataGridRatingCell;
        break;
      case "percentage":
        Comp = DataGridPercentageCell;
        break;
      case "color":
        Comp = DataGridColorCell;
        break;
      case "money":
        Comp = DataGridMoneyCell;
        break;
      case "json":
        Comp = DataGridJsonCell;
        break;
      case "duration":
        Comp = DataGridDurationCell;
        break;
      default:
        Comp = DataGridTextCell;
        break;
    }

  return (
    <Comp
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly || disabled}
    />
  );
}

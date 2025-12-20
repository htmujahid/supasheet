import React from "react";

import { Badge } from "@/components/ui/badge";
import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";
import { getLineCount } from "@/features/resource/lib/utils/data-grid";
import { useBadgeOverflow } from "@/hooks/use-badge-overflow";

import { ColumnMetadata } from "../../fields/types";
import { DataGridCellWrapper } from "../data-grid-cell-wrapper";
import { DataGridArrayEditSheet } from "./data-grid-array-edit-sheet";

export function DataGridArrayCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as unknown[] | null;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cellOpts = cell.column.columnDef.meta as ColumnMetadata;

  // Track the current value for syncing
  const prevInitialValueRef = React.useRef(initialValue);
  const [currentValue, setCurrentValue] = React.useState(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setCurrentValue(initialValue);
  }

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onSave = React.useCallback(
    (value: unknown[] | null | "") => {
      if (!readOnly) {
        tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
      }
      tableMeta?.onCellEditingStop?.();
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onCancel = React.useCallback(() => {
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta]);

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing && event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (!isEditing && isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, onCancel, tableMeta],
  );

  const lineCount = getLineCount(rowHeight);

  const { visibleItems, hiddenCount } = useBadgeOverflow({
    items: currentValue ?? [],
    getLabel: (item) => String(item),
    containerRef,
    lineCount,
    cacheKeyPrefix: "array",
  });

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
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
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      <DataGridArrayEditSheet
        open={isEditing}
        onOpenChange={onOpenChange}
        initialValue={currentValue}
        columnMetadata={cellOpts}
        onSave={onSave}
        onCancel={onCancel}
      />

      {/* Display mode */}
      {currentValue === null ? (
        <span className="text-muted-foreground italic">null</span>
      ) : currentValue?.length === 0 ? (
        <span className="text-muted-foreground italic">[]</span>
      ) : (
        <div className="flex flex-wrap items-center gap-1 overflow-hidden">
          {visibleItems.map((v, i) => (
            <Badge key={i} variant="outline" className="shrink-0 text-xs">
              {String(v)}
            </Badge>
          ))}
          {hiddenCount > 0 && (
            <Badge
              variant="outline"
              className="text-muted-foreground shrink-0 px-1.5 text-xs"
            >
              +{hiddenCount}
            </Badge>
          )}
        </div>
      )}
    </DataGridCellWrapper>
  );
}

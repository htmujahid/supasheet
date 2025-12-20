import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellOpts = cell.column.columnDef.meta as ColumnMetadata;
  const prevIsEditingRef = useRef(isEditing);

  // Track the current value for syncing
  const prevInitialValueRef = useRef(initialValue);
  const [currentValue, setCurrentValue] = useState(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setCurrentValue(initialValue);
  }

  // Only open sheet when isEditing transitions from false to true
  useEffect(() => {
    if (isEditing && !readOnly && !prevIsEditingRef.current) {
      setSheetOpen(true);
    }
    prevIsEditingRef.current = isEditing;
  }, [isEditing, readOnly]);
  const onSheetOpenChange = useCallback(
    (open: boolean) => {
      setSheetOpen(open);
      if (!open) {
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta],
  );

  const onSave = useCallback(
    (value: unknown[] | null | "") => {
      if (!readOnly) {
        setCurrentValue(value === "" ? null : value);
        tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
      }
      setSheetOpen(false);
      tableMeta?.onCellEditingStop?.();
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onCancel = useCallback(() => {
    setSheetOpen(false);
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta]);

  const onWrapperKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isEditing && isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, tableMeta],
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
    <>
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
        {/* Display mode */}
        {currentValue === null ? null : currentValue?.length === 0 ? (
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
      {sheetOpen && (
        <DataGridArrayEditSheet
          open={sheetOpen}
          onOpenChange={onSheetOpenChange}
          initialValue={currentValue}
          columnMetadata={cellOpts}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </>
  );
}

import React from "react";

import { Rating, RatingItem } from "@/components/ui/rating";
import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";

import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

export function DataGridRatingCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: Omit<DataGridCellProps<TData>, "isEditing">) {
  const initialValue = cell.getValue() as number | null;
  const [value, setValue] = React.useState(initialValue ?? 0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const prevInitialValueRef = React.useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? 0);
  }

  const onValueChange = React.useCallback(
    (newValue: number) => {
      if (readOnly) return;
      setValue(newValue);
      tableMeta?.onDataUpdate?.({
        rowIndex,
        columnId,
        value: newValue || null,
      });
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isFocused, tableMeta],
  );

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={false}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      <Rating
        value={value}
        onValueChange={onValueChange}
        step={0.5}
        readOnly={readOnly}
        disabled={readOnly}
        clearable
      >
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i} />
        ))}
      </Rating>
    </DataGridCellWrapper>
  );
}

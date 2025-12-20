import React from "react";

import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";

import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

export function DataGridColorCell<TData>({
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
  const initialValue = cell.getValue() as string;
  const [value, setValue] = React.useState(initialValue ?? "#000000");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const prevInitialValueRef = React.useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "#000000");
  }

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      if (!readOnly) {
        tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
      }
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onInputClick = React.useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (!readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      }
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onInputBlur = React.useCallback(() => {
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta]);

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFocused && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        inputRef.current?.click();
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isFocused, tableMeta],
  );

  const onWrapperClick = React.useCallback(() => {
    if (isFocused && !readOnly) {
      inputRef.current?.click();
    }
  }, [isFocused, readOnly]);

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
      onClick={onWrapperClick}
    >
      <div className="flex items-center gap-2">
        <input
          type="color"
          ref={inputRef}
          value={value}
          onChange={onChange}
          onClick={onInputClick}
          onBlur={onInputBlur}
          disabled={readOnly}
          className="size-4 cursor-pointer rounded border-0 p-0"
        />
        <span
          data-slot="grid-cell-content"
          className="text-muted-foreground text-xs"
        >
          {value}
        </span>
      </div>
    </DataGridCellWrapper>
  );
}

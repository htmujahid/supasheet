import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

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
  const [value, setValue] = useState(initialValue ?? "#000000");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "#000000");
  }

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      if (!readOnly) {
        tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
      }
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onInputClick = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (!readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      }
    },
    [tableMeta, rowIndex, columnId, readOnly],
  );

  const onInputBlur = useCallback(() => {
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta]);

  const onWrapperKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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

  const onWrapperClick = useCallback(() => {
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

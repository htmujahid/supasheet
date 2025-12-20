import React from "react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

export function DataGridJsonCell<TData>({
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
  const initialValue = cell.getValue() as unknown;
  const initialStringValue = initialValue
    ? JSON.stringify(initialValue, null, 2)
    : "";
  const [value, setValue] = React.useState(initialStringValue);
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sideOffset = -(containerRef.current?.clientHeight ?? 0);

  const prevInitialValueRef = React.useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    const newStringValue = initialValue
      ? JSON.stringify(initialValue, null, 2)
      : "";
    setValue(newStringValue);
    setError(null);
  }

  const debouncedSave = useDebouncedCallback((newValue: string) => {
    if (readOnly) return;
    try {
      const parsed = newValue ? JSON.parse(newValue) : null;
      setError(null);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: parsed });
    } catch {
      setError("Invalid JSON");
    }
  }, 300);

  const onSave = React.useCallback(() => {
    if (readOnly) {
      tableMeta?.onCellEditingStop?.();
      return;
    }
    try {
      const parsed = value ? JSON.parse(value) : null;
      setError(null);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: parsed });
      tableMeta?.onCellEditingStop?.();
    } catch {
      setError("Invalid JSON");
    }
  }, [tableMeta, value, rowIndex, columnId, readOnly]);

  const onCancel = React.useCallback(() => {
    setValue(initialStringValue);
    setError(null);
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, initialStringValue]);

  const onOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (isOpen && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        if (!readOnly && value !== initialStringValue) {
          try {
            const parsed = value ? JSON.parse(value) : null;
            tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: parsed });
          } catch {
            // Revert if invalid JSON
            setValue(initialStringValue);
          }
        }
        setError(null);
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, value, initialStringValue, rowIndex, columnId, readOnly],
  );

  const onOpenAutoFocus: NonNullable<
    React.ComponentProps<typeof PopoverContent>["onOpenAutoFocus"]
  > = React.useCallback((event) => {
    event.preventDefault();
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      debouncedSave(newValue);
    },
    [debouncedSave],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSave();
      } else if (event.key === "Tab") {
        event.preventDefault();
        if (value !== initialStringValue) {
          try {
            const parsed = value ? JSON.parse(value) : null;
            tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: parsed });
          } catch {
            setValue(initialStringValue);
          }
        }
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
      event.stopPropagation();
    },
    [
      onSave,
      onCancel,
      value,
      initialStringValue,
      tableMeta,
      rowIndex,
      columnId,
    ],
  );

  const displayValue = initialValue ? JSON.stringify(initialValue) : "";

  return (
    <Popover open={isEditing} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
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
        >
          <pre
            data-slot="grid-cell-content"
            className="truncate font-mono text-xs"
          >
            {displayValue}
          </pre>
        </DataGridCellWrapper>
      </PopoverAnchor>
      <PopoverContent
        data-grid-cell-editor=""
        align="start"
        side="bottom"
        sideOffset={sideOffset}
        className="w-[400px] rounded-none p-0"
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <div className="flex flex-col">
          <Textarea
            placeholder="Enter JSON..."
            className="max-h-[300px] min-h-[150px] resize-none overflow-y-auto rounded-none border-0 font-mono text-xs shadow-none focus-visible:ring-0"
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          {error && (
            <div className="bg-destructive/10 text-destructive border-t px-3 py-2 text-xs">
              {error}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

import React from "react";

import { format } from "date-fns";

import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";

import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

function getUserTimezoneOffset(): string {
  const offset = new Date().getTimezoneOffset();
  const sign = offset <= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function convertDbTimeToUserTimezone(dbValue: string): string {
  if (!dbValue) return "";

  // Normalize timezone: "10:30:00+05" -> "10:30:00+05:00"
  const normalized = dbValue.replace(/([+-]\d{2})$/, "$1:00");

  // Create a full datetime string with today's date to leverage Date parsing
  const today = format(new Date(), "yyyy-MM-dd");
  const date = new Date(`${today}T${normalized}`);

  if (isNaN(date.getTime())) {
    // Fallback: strip timezone and return time part
    return dbValue.replace(/[+-]\d{2}(:\d{2})?$/, "").substring(0, 8);
  }

  // Format to user's local time (Date automatically converts to local timezone)
  return format(date, "HH:mm:ss");
}

export function DataGridTimeCell<TData>({
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
  // Edit value: converted to user's local timezone for the time input
  const [editValue, setEditValue] = React.useState(
    convertDbTimeToUserTimezone(initialValue),
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const prevInitialValueRef = React.useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setEditValue(convertDbTimeToUserTimezone(initialValue));
  }

  const getValueWithUserTimezone = React.useCallback((timeValue: string) => {
    // Append user's current timezone to the time value for storage
    if (!timeValue) return null;
    return `${timeValue}${getUserTimezoneOffset()}`;
  }, []);

  const onBlur = React.useCallback(() => {
    const originalEditValue = convertDbTimeToUserTimezone(initialValue);
    if (!readOnly && editValue !== originalEditValue) {
      tableMeta?.onDataUpdate?.({
        rowIndex,
        columnId,
        value: getValueWithUserTimezone(editValue),
      });
    }
    tableMeta?.onCellEditingStop?.();
  }, [
    tableMeta,
    rowIndex,
    columnId,
    initialValue,
    editValue,
    readOnly,
    getValueWithUserTimezone,
  ]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(event.target.value);
    },
    [],
  );

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const originalEditValue = convertDbTimeToUserTimezone(initialValue);
      if (isEditing) {
        if (event.key === "Enter") {
          event.preventDefault();
          if (editValue !== originalEditValue) {
            tableMeta?.onDataUpdate?.({
              rowIndex,
              columnId,
              value: getValueWithUserTimezone(editValue),
            });
          }
          tableMeta?.onCellEditingStop?.({ moveToNextRow: true });
        } else if (event.key === "Tab") {
          event.preventDefault();
          if (editValue !== originalEditValue) {
            tableMeta?.onDataUpdate?.({
              rowIndex,
              columnId,
              value: getValueWithUserTimezone(editValue),
            });
          }
          tableMeta?.onCellEditingStop?.({
            direction: event.shiftKey ? "left" : "right",
          });
        }
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      } else if (!isEditing && event.key === "Escape") {
        event.preventDefault();
        setEditValue(convertDbTimeToUserTimezone(initialValue));
        inputRef.current?.blur();
      }
    },
    [
      isEditing,
      isFocused,
      initialValue,
      tableMeta,
      rowIndex,
      columnId,
      editValue,
      getValueWithUserTimezone,
    ],
  );

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
      {isEditing ? (
        <input
          ref={inputRef}
          type="time"
          step="1"
          value={editValue}
          onBlur={onBlur}
          onChange={onChange}
          className="w-full border-none bg-transparent p-0 outline-none"
        />
      ) : (
        <span data-slot="grid-cell-content">{initialValue}</span>
      )}
    </DataGridCellWrapper>
  );
}

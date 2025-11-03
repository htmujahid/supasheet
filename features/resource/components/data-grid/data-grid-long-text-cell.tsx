"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cell, Table } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

import { updateResourceDataAction } from "../../lib/actions";
import { DataGridCellWrapper } from "./data-grid-cell-wrapper";

interface CellVariantProps<TData> {
  cell: Cell<TData, unknown>;
  table: Table<TData>;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  isFocused: boolean;
  isSelected: boolean;
}

export function DataGridLongTextCell<TData>({
  cell,
  table,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
}: CellVariantProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue ?? "");
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = table.options.meta;
  const sideOffset = -(containerRef.current?.clientHeight ?? 0);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "");
  }

  // Debounced auto-save (300ms delay)
  const debouncedSave = useDebouncedCallback((newValue: string) => {
    meta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
  }, 300);

  const onSave = useCallback(() => {
    // Immediately save any pending changes and close the popover
    if (value !== initialValue) {
      const row = cell.row.original;
      const cellOpts = cell.column.columnDef.meta;

      const resourceIds =
        cellOpts?.primaryKeys?.reduce(
          (acc, key) => {
            acc[key.name] = row[key.name as keyof TData];
            return acc;
          },
          {} as Record<string, unknown>,
        ) ?? {};

      updateResourceDataAction({
        schema: cellOpts?.schema as never,
        resourceName: cellOpts?.table as never,
        resourceIds,
        data: { [columnId]: value },
      }).catch((error) => {
        toast.error(error.message);
      });
      meta?.onDataUpdate?.({ rowIndex, columnId, value });
    }
    setOpen(false);
    meta?.onCellEditingStop?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, value, initialValue, rowIndex, columnId]);

  const onCancel = useCallback(() => {
    // Restore the original value
    setValue(initialValue ?? "");
    meta?.onDataUpdate?.({ rowIndex, columnId, value: initialValue });
    setOpen(false);
    meta?.onCellEditingStop?.();
  }, [meta, initialValue, rowIndex, columnId]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      // Debounced auto-save
      debouncedSave(newValue);
    },
    [debouncedSave],
  );

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Immediately save any pending changes when closing
        if (value !== initialValue) {
          meta?.onDataUpdate?.({ rowIndex, columnId, value });
        }
        meta?.onCellEditingStop?.();
      }
    },
    [meta, value, initialValue, rowIndex, columnId],
  );

  const onOpenAutoFocus: NonNullable<
    React.ComponentProps<typeof PopoverContent>["onOpenAutoFocus"]
  > = useCallback((event) => {
    event.preventDefault();
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing && !open) {
        if (event.key === "Escape") {
          event.preventDefault();
          meta?.onCellEditingStop?.();
        } else if (event.key === "Tab") {
          event.preventDefault();
          // Save any pending changes
          if (value !== initialValue) {
            meta?.onDataUpdate?.({ rowIndex, columnId, value });
          }
          meta?.onCellEditingStop?.({
            direction: event.shiftKey ? "left" : "right",
          });
        }
      }
    },
    [isEditing, open, meta, value, initialValue, rowIndex, columnId],
  );

  const onTextareaKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSave();
      }
      // Stop propagation to prevent grid navigation
      event.stopPropagation();
    },
    [onCancel, onSave],
  );

  const onTextareaBlur = useCallback(() => {
    // Immediately save any pending changes on blur
    if (value !== initialValue) {
      meta?.onDataUpdate?.({ rowIndex, columnId, value });
    }
    setOpen(false);
    meta?.onCellEditingStop?.();
  }, [meta, value, initialValue, rowIndex, columnId]);

  useEffect(() => {
    if (isEditing && !open) {
      setOpen(true);
    }
    if (
      isFocused &&
      !isEditing &&
      !meta?.searchOpen &&
      !meta?.isScrolling &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [isFocused, isEditing, open, meta?.searchOpen, meta?.isScrolling]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <DataGridCellWrapper
          ref={containerRef}
          cell={cell}
          table={table}
          rowIndex={rowIndex}
          columnId={columnId}
          isEditing={isEditing}
          isFocused={isFocused}
          isSelected={isSelected}
          onKeyDown={onWrapperKeyDown}
        >
          <span data-slot="grid-cell-content">{value}</span>
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
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onTextareaKeyDown}
          onBlur={onTextareaBlur}
          className="min-h-[150px] resize-none rounded-none border-0 shadow-none focus-visible:ring-0"
          placeholder="Enter text..."
        />
      </PopoverContent>
    </Popover>
  );
}

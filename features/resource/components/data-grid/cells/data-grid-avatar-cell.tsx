import React from "react";

import { User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DataGridCellProps,
  FileCellData,
} from "@/features/resource/lib/types/data-grid";

import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

export function DataGridAvatarCell<TData>({
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
  const cellValue = cell.getValue() as FileCellData | null;
  const [value, setValue] = React.useState<FileCellData | null>(cellValue);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const prevCellValueRef = React.useRef(cellValue);
  if (cellValue !== prevCellValueRef.current) {
    prevCellValueRef.current = cellValue;
    setValue(cellValue);
  }

  const onFileInputChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || readOnly) return;

      let uploadedFile: FileCellData;

      if (tableMeta?.onFilesUpload) {
        try {
          const result = await tableMeta.onFilesUpload({
            files: [file],
            rowIndex,
            columnId,
          });
          uploadedFile = result[0]!;
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to upload avatar",
          );
          return;
        }
      } else {
        uploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          last_modified: new Date(file.lastModified).toISOString(),
        };
      }

      setValue(uploadedFile);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: uploadedFile });
      tableMeta?.onCellEditingStop?.();
      event.target.value = "";
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

  const onWrapperKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isFocused && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        fileInputRef.current?.click();
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
      fileInputRef.current?.click();
    }
  }, [isFocused, readOnly]);

  React.useEffect(() => {
    return () => {
      if (value?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(value.url);
      }
    };
  }, [value]);

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
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        ref={fileInputRef}
        onClick={onInputClick}
        onChange={onFileInputChange}
      />
      <Avatar className="size-5.5">
        <AvatarImage alt="Avatar" src={value?.url} />
        <AvatarFallback className="rounded-none bg-transparent">
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    </DataGridCellWrapper>
  );
}

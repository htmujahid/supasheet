import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import Link from "next/link";

import { ArrowUpRightIcon } from "lucide-react";

import { DataGridCellProps } from "@/features/resource/lib/types/data-grid";
import { ResourceDataSchema } from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

import { ColumnMetadata } from "../../fields/types";
import { ForeignTableSheet } from "../../sheet-table/foreign-table-sheet";
import { DataGridCellWrapper } from "../data-grid-cell-wrapper";

export function DataGridForeignKeyCell<TData>({
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
  const initialValue = cell.getValue() as string | number | null;
  const [value, setValue] = useState(initialValue);
  const [sheetOpen, setSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellOpts = cell.column.columnDef.meta as ColumnMetadata;
  const relationship = cellOpts?.relationship;
  const prevIsEditingRef = useRef(isEditing);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue);
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

  const setRecord = useCallback(
    (record: ResourceDataSchema) => {
      if (!relationship || readOnly) return;
      const newValue = record[relationship.target_column_name];
      setValue(newValue as string | number | null);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
      setSheetOpen(false);
      tableMeta?.onCellEditingStop?.();
    },
    [relationship, tableMeta, rowIndex, columnId, readOnly],
  );

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

  const foreignKeyLink = relationship
    ? `/home/${relationship.target_table_schema}/resource/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"text","operator":"eq","filterId":"fk"}]`
    : "#";

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
        className={cn(relationship && "pl-6")}
      >
        {/* don't wrap to second line */}
        <span data-slot="grid-cell-content" className="whitespace-nowrap">
          {value?.toString() ?? ""}
        </span>
        {relationship && value && (
          <Link
            href={foreignKeyLink}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="hover:bg-accent absolute top-1/2 left-1 -translate-y-1/2 rounded border p-0.5"
          >
            <ArrowUpRightIcon className="size-3" />
          </Link>
        )}
      </DataGridCellWrapper>
      {relationship && sheetOpen && (
        <ForeignTableSheet
          open={sheetOpen}
          onOpenChange={onSheetOpenChange}
          relationship={relationship}
          setRecord={setRecord}
        />
      )}
    </>
  );
}

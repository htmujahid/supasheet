"use client";

import * as React from "react";

import type { Table, TableMeta } from "@tanstack/react-table";
import {
  ClipboardIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ContextMenuState } from "../../lib/types/data-grid";
import { parseCellKey } from "../../lib/utils/data-grid";
import { useResourceContext } from "../resource-context";

interface DataGridContextMenuProps<TData> {
  table: Table<TData>;
  tableMeta: TableMeta<TData>;
  contextMenu: ContextMenuState;
}

export function DataGridContextMenu<TData>({
  table,
  tableMeta,
  contextMenu,
}: DataGridContextMenuProps<TData>) {
  const onContextMenuOpenChange = tableMeta?.onContextMenuOpenChange;
  const selectionState = tableMeta?.selectionState;
  const dataGridRef = tableMeta?.dataGridRef;

  if (!contextMenu.open) return null;

  return (
    <ContextMenu
      table={table}
      tableMeta={tableMeta}
      dataGridRef={dataGridRef}
      contextMenu={contextMenu}
      onContextMenuOpenChange={onContextMenuOpenChange}
      selectionState={selectionState}
    />
  );
}

interface ContextMenuProps<TData>
  extends Pick<
      TableMeta<TData>,
      "dataGridRef" | "onContextMenuOpenChange" | "selectionState"
    >,
    Required<Pick<TableMeta<TData>, "contextMenu">> {
  table: Table<TData>;
  tableMeta: TableMeta<TData>;
}

const ContextMenu = React.memo(ContextMenuImpl, (prev, next) => {
  if (prev.contextMenu.open !== next.contextMenu.open) return false;
  if (!next.contextMenu.open) return true;
  if (prev.contextMenu.x !== next.contextMenu.x) return false;
  if (prev.contextMenu.y !== next.contextMenu.y) return false;

  const prevSize = prev.selectionState?.selectedCells?.size ?? 0;
  const nextSize = next.selectionState?.selectedCells?.size ?? 0;
  if (prevSize !== nextSize) return false;

  return true;
}) as typeof ContextMenuImpl;

function ContextMenuImpl<TData>({
  table,
  tableMeta,
  dataGridRef,
  contextMenu,
  onContextMenuOpenChange,
  selectionState,
}: ContextMenuProps<TData>) {
  const { setResourceAction, permissions } = useResourceContext();

  const triggerStyle = React.useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      left: `${contextMenu.x}px`,
      top: `${contextMenu.y}px`,
      width: "1px",
      height: "1px",
      padding: 0,
      margin: 0,
      border: "none",
      background: "transparent",
      pointerEvents: "none",
      opacity: 0,
    }),
    [contextMenu.x, contextMenu.y],
  );

  // Get selected row data
  const selectedRowData = React.useMemo(() => {
    if (
      !selectionState?.selectedCells ||
      selectionState.selectedCells.size === 0
    )
      return null;

    // Get the first selected cell to determine the row
    const firstCellKey = selectionState.selectedCells.values().next().value;
    if (!firstCellKey) return null;

    const { rowIndex } = parseCellKey(firstCellKey);
    const rows = table.getRowModel().rows;
    const row = rows[rowIndex];

    return row?.original as Record<string, unknown> | null;
  }, [selectionState, table]);

  // Check if only one row is selected
  const isSingleRowSelected = React.useMemo(() => {
    if (
      !selectionState?.selectedCells ||
      selectionState.selectedCells.size === 0
    )
      return false;

    const rowIndices = new Set<number>();
    for (const cellKey of selectionState.selectedCells) {
      const { rowIndex } = parseCellKey(cellKey);
      rowIndices.add(rowIndex);
    }

    return rowIndices.size === 1;
  }, [selectionState]);

  const onCloseAutoFocus: NonNullable<
    React.ComponentProps<typeof DropdownMenuContent>["onCloseAutoFocus"]
  > = React.useCallback(
    (event) => {
      event.preventDefault();
      dataGridRef?.current?.focus();
    },
    [dataGridRef],
  );

  const onCopyRow = React.useCallback(() => {
    if (!selectedRowData) return;

    navigator.clipboard.writeText(JSON.stringify(selectedRowData, null, 2));
    toast.success("Row copied to clipboard");
  }, [selectedRowData]);

  const onCopyCell = React.useCallback(() => {
    if (
      !selectionState?.selectedCells ||
      selectionState.selectedCells.size !== 1
    )
      return;

    const cellKey = selectionState.selectedCells.values().next().value;
    if (!cellKey) return;

    const { rowIndex, columnId } = parseCellKey(cellKey);
    const row = table.getRowModel().rows[rowIndex];
    const cellValue = row?.getValue(columnId);

    navigator.clipboard.writeText(String(cellValue));
    toast.success("Cell content copied to clipboard");
  }, [selectionState, table]);

  const onView = React.useCallback(() => {
    if (!selectedRowData) return;

    setResourceAction({
      variant: "view",
      data: selectedRowData,
    });
  }, [selectedRowData, setResourceAction]);

  const onEdit = React.useCallback(() => {
    if (!selectedRowData) return;

    setResourceAction({
      variant: "update",
      data: selectedRowData,
    });
  }, [selectedRowData, setResourceAction]);

  const onDelete = React.useCallback(async () => {
    if (
      !selectionState?.selectedCells ||
      selectionState.selectedCells.size === 0 ||
      !selectedRowData
    )
      return;

    setResourceAction({
      variant: "delete",
      data: selectedRowData,
    });
  }, [selectionState, selectedRowData, setResourceAction]);

  return (
    <DropdownMenu
      open={contextMenu.open}
      onOpenChange={onContextMenuOpenChange}
    >
      <DropdownMenuTrigger style={triggerStyle} />
      <DropdownMenuContent
        data-grid-popover=""
        align="start"
        className="w-52"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DropdownMenuItem onSelect={onCopyRow} disabled={!isSingleRowSelected}>
          <CopyIcon />
          Copy Row
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onCopyCell}
          disabled={selectionState?.selectedCells?.size !== 1}
        >
          <ClipboardIcon />
          Copy Cell Content
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onView}
          disabled={!isSingleRowSelected || !permissions.canSelect}
        >
          <EyeIcon />
          View Details
        </DropdownMenuItem>
        {permissions.canUpdate && (
          <DropdownMenuItem
            onSelect={onEdit}
            disabled={!isSingleRowSelected || tableMeta?.readOnly}
          >
            <EditIcon />
            Edit Details
          </DropdownMenuItem>
        )}
        {permissions.canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2Icon />
              Delete rows
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

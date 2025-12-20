"use client";

import * as React from "react";

import { DataTablePagination } from "@/interfaces/data-table/components/data-table-pagination";
import { cn } from "@/lib/utils";

import type { useDataGrid } from "../../lib/hooks/use-data-grid";
import type { Direction } from "../../lib/types/data-grid";
import { flexRender, getCommonPinningStyles } from "../../lib/utils/data-grid";
import { DataGridColumnHeader } from "./data-grid-column-header";
import { DataGridContextMenu } from "./data-grid-context-menu";
import { DataGridPasteDialog } from "./data-grid-paste-dialog";
import { DataGridRow } from "./data-grid-row";
import { DataGridSearch } from "./data-grid-search";

const EMPTY_CELL_SELECTION_SET = new Set<string>();

interface DataGridProps<TData>
  extends Omit<
      ReturnType<typeof useDataGrid<TData>>,
      | "dir"
      | "shallow"
      | "debounceMs"
      | "throttleMs"
      | "pagination"
      | "filters"
      | "setFilters"
      | "joinOperator"
      | "setJoinOperator"
    >,
    Omit<React.ComponentProps<"div">, "contextMenu"> {
  dir?: Direction;
  height?: number;
  stretchColumns?: boolean;
  isPagination?: boolean;
}

export function DataGrid<TData>({
  dataGridRef,
  headerRef,
  rowMapRef,
  footerRef,
  dir = "ltr",
  table,
  tableMeta,
  virtualTotalSize,
  virtualItems,
  measureElement,
  columns,
  columnSizeVars,
  searchState,
  searchMatchesByRow,
  activeSearchMatch,
  cellSelectionMap,
  focusedCell,
  editingCell,
  rowHeight,
  contextMenu,
  pasteDialog,
  onRowAdd: _,
  height = 600,
  stretchColumns = false,
  isPagination = true,
  className,
  ...props
}: DataGridProps<TData>) {
  const rows = table.getRowModel().rows;
  const readOnly = tableMeta?.readOnly ?? false;
  const columnVisibility = table.getState().columnVisibility;
  const columnPinning = table.getState().columnPinning;

  const onDataGridContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  return (
    <div
      data-slot="grid-wrapper"
      dir={dir}
      {...props}
      className={cn("relative flex w-full flex-col", className)}
    >
      {searchState && <DataGridSearch {...searchState} />}
      <DataGridContextMenu
        table={table}
        tableMeta={tableMeta}
        contextMenu={contextMenu}
      />
      <DataGridPasteDialog tableMeta={tableMeta} pasteDialog={pasteDialog} />
      <div className="overflow-hidden rounded-md border">
        <div
          role="grid"
          aria-label="Data grid"
          aria-rowcount={rows.length}
          aria-colcount={columns.length}
          data-slot="grid"
          tabIndex={0}
          ref={dataGridRef}
          className="relative grid h-[calc(100svh-147px)] grid-rows-[auto_1fr] overflow-auto select-none focus:outline-none"
          style={{
            ...columnSizeVars,
            maxHeight: `${height}px`,
          }}
          onContextMenu={onDataGridContextMenu}
        >
          <div
            role="rowgroup"
            data-slot="grid-header"
            ref={headerRef}
            className="bg-background sticky top-0 z-10 border-b"
          >
            {table.getHeaderGroups().map((headerGroup, rowIndex) => (
              <div
                key={headerGroup.id}
                role="row"
                aria-rowindex={rowIndex + 1}
                data-slot="grid-header-row"
                tabIndex={-1}
                className="flex w-full"
              >
                {headerGroup.headers.map((header, colIndex) => {
                  const sorting = table.getState().sorting;
                  const currentSort = sorting.find(
                    (sort) => sort.id === header.column.id,
                  );
                  const isSortable = header.column.getCanSort();

                  return (
                    <div
                      key={header.id}
                      role="columnheader"
                      aria-colindex={colIndex + 1}
                      aria-sort={
                        currentSort?.desc === false
                          ? "ascending"
                          : currentSort?.desc === true
                            ? "descending"
                            : isSortable
                              ? "none"
                              : undefined
                      }
                      data-slot="grid-header-cell"
                      tabIndex={-1}
                      className={cn("relative", {
                        grow: stretchColumns && header.column.id !== "select",
                        "border-e": header.column.id !== "select",
                      })}
                      style={{
                        ...getCommonPinningStyles({
                          column: header.column,
                          dir,
                        }),
                        width: `calc(var(--header-${header.id}-size) * 1px)`,
                      }}
                    >
                      {header.isPlaceholder ? null : typeof header.column
                          .columnDef.header === "function" ? (
                        <div className="size-full px-3 py-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      ) : (
                        <DataGridColumnHeader header={header} table={table} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div
            role="rowgroup"
            data-slot="grid-body"
            className="relative grid"
            style={{
              height: `${virtualTotalSize}px`,
              contain: "strict",
            }}
          >
            {virtualItems.map((virtualItem) => {
              const row = rows[virtualItem.index];
              if (!row) return null;

              const cellSelectionKeys =
                cellSelectionMap?.get(virtualItem.index) ??
                EMPTY_CELL_SELECTION_SET;

              const searchMatchColumns =
                searchMatchesByRow?.get(virtualItem.index) ?? null;
              const isActiveSearchRow =
                activeSearchMatch?.rowIndex === virtualItem.index;

              return (
                <DataGridRow
                  key={row.id}
                  row={row}
                  tableMeta={tableMeta}
                  rowMapRef={rowMapRef}
                  virtualItem={virtualItem}
                  measureElement={measureElement}
                  rowHeight={rowHeight}
                  columnVisibility={columnVisibility}
                  columnPinning={columnPinning}
                  focusedCell={focusedCell}
                  editingCell={editingCell}
                  cellSelectionKeys={cellSelectionKeys}
                  searchMatchColumns={searchMatchColumns}
                  activeSearchMatch={
                    isActiveSearchRow ? activeSearchMatch : null
                  }
                  dir={dir}
                  readOnly={readOnly}
                  stretchColumns={stretchColumns}
                />
              );
            })}
          </div>
        </div>
      </div>
      {isPagination && <DataTablePagination table={table} ref={footerRef} />}
    </div>
  );
}

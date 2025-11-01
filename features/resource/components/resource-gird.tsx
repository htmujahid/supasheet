"use client";

import { useCallback, useMemo } from "react";
import { useWindowSize } from "@/hooks/use-window-size";
import {
  ColumnSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { type UseDataGridProps, useDataGrid } from "../lib/hooks/use-data-grid";
import { loadResourceData } from "../lib/loaders";
import { DataGrid } from "./data-grid/data-grid";
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts";
import { DataGridRowHeightMenu } from "./data-grid/data-grid-row-height-menu";
import { DataGridSortMenu } from "./data-grid/data-grid-sort-menu";
import { DataGridViewMenu } from "./data-grid/data-grid-view-menu";
import { getResourceGridColumns } from "./resource-grid-columns";
import { useResourceContext } from "./resource-context";

export function ResourceGrid({
  tableSchema,
  columnsSchema,
  data,
}: {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[] | null;
  data: Awaited<ReturnType<typeof loadResourceData>> | null;
}) {
  const { setResourceAction } = useResourceContext();
  const windowSize = useWindowSize({ defaultHeight: 760 });

  const columns = useMemo(
    () =>
      getResourceGridColumns({
        columnsSchema: columnsSchema ?? [],
        tableSchema,
      }),
    [columnsSchema, tableSchema],
  );

  const onRowAdd: NonNullable<
    UseDataGridProps<Record<string, unknown>>["onRowAdd"]
  > = useCallback(() => {
    return {
      rowIndex: data.length,
      columnId: "name",
    };
  }, [data.length]);

  const onRowsDelete: NonNullable<
    UseDataGridProps<Record<string, unknown>>["onRowsDelete"]
  > = useCallback((rows) => {
    setResourceAction({
      variant: "delete",
      data: rows[0]
    });
  }, [setResourceAction]);

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data: data.results,
    onDataChange: () => { },
    onRowAdd,
    onRowsDelete,
    enableSearch: true,
  });

  const height = Math.max(400, windowSize.height - 105);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DataGridSortMenu table={table} />
        </div>
        <DataGridRowHeightMenu table={table} />
        <DataGridViewMenu table={table} />
      </div>
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid
        {...dataGridProps}
        table={table}
        height={height}
        onRowAdd={async () => {
          setResourceAction({ variant: "create" });
        }}
      />
    </div>
  );
}

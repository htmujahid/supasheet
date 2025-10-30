"use client";

import * as React from "react";
import { useState } from "react";

import { Row } from "@tanstack/react-table";

import { If } from "@/components/makerkit/if";
import { useWindowSize } from "@/hooks/use-window-size";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { type UseDataGridProps, useDataGrid } from "../lib/hooks/use-data-grid";
import { loadResourceData } from "../lib/loaders";
import { DataGrid } from "./data-grid/data-grid";
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts";
import { DataGridRowHeightMenu } from "./data-grid/data-grid-row-height-menu";
import { DataGridSortMenu } from "./data-grid/data-grid-sort-menu";
import { DataGridViewMenu } from "./data-grid/data-grid-view-menu";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { getResourceGridColumns } from "./resource-grid-columns";
import { ResourceSheet } from "./resource-sheet";

export function ResourceGrid({
  tableSchema,
  columnsSchema,
  data,
}: {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[] | null;
  data: Awaited<ReturnType<typeof loadResourceData>> | null;
}) {
  const windowSize = useWindowSize({ defaultHeight: 760 });
  const [createResourceOpen, setCreateResourceOpen] = useState(false);
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<ResourceDataSchema> | null>(null);

  const columns = React.useMemo(
    () =>
      getResourceGridColumns({
        columnsSchema: columnsSchema ?? [],
        tableSchema,
      }),
    [columnsSchema, tableSchema],
  );

  const onRowAdd: NonNullable<
    UseDataGridProps<Record<string, unknown>>["onRowAdd"]
  > = React.useCallback(() => {
    return {
      rowIndex: data.length,
      columnId: "name",
    };
  }, [data.length]);

  const onRowsDelete: NonNullable<
    UseDataGridProps<Record<string, unknown>>["onRowsDelete"]
  > = React.useCallback((rows) => {
    setRowAction({
      variant: "delete",
      row: { original: rows[0] } as Row<ResourceDataSchema>,
    });
  }, []);

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
          setCreateResourceOpen(true);
        }}
      />
      <If condition={createResourceOpen}>
        <ResourceSheet
          tableSchema={tableSchema}
          columnsSchema={columnsSchema ?? []}
          data={null}
          open={createResourceOpen}
          onOpenChange={setCreateResourceOpen}
        />
      </If>
      <If condition={rowAction?.variant === "delete" && tableSchema}>
        <DeleteResourceDialog
          open={rowAction?.variant === "delete"}
          onOpenChange={() => setRowAction(null)}
          resources={rowAction?.row.original ? [rowAction?.row.original] : []}
          tableSchema={tableSchema ?? null}
          columnSchema={columnsSchema ?? []}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      </If>
    </div>
  );
}

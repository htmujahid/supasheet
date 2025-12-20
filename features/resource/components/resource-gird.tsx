"use client";

import { useCallback, useMemo } from "react";

import { toast } from "sonner";

import { useWindowSize } from "@/hooks/use-window-size";
import { DataTableFilterList } from "@/interfaces/data-table/components/data-table-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  TableSchema,
} from "@/lib/database-meta.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import { updateResourceDataAction } from "../lib/actions";
import { type UseDataGridProps, useDataGrid } from "../lib/hooks/use-data-grid";
import { loadResourceData } from "../lib/loaders";
import { FileCellData, UpdateCell } from "../lib/types/data-grid";
import { getJsonColumns, parseJsonColumns } from "../lib/utils";
import { DataGrid } from "./data-grid/data-grid";
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts";
import { DataGridRowHeightMenu } from "./data-grid/data-grid-row-height-menu";
import { DataGridViewMenu } from "./data-grid/data-grid-view-menu";
import {
  deleteFileFromStorage,
  uploadFileToStorage,
} from "./fields/file-field-storage";
import { useResourceContext } from "./resource-context";
import { getResourceGridColumns } from "./resource-grid-columns";

export function ResourceGrid({
  tableSchema,
  columnsSchema,
  data,
}: {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[] | null;
  data: Awaited<ReturnType<typeof loadResourceData>> | null;
}) {
  const client = useSupabase();
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

  const onRowsDelete: NonNullable<
    UseDataGridProps<Record<string, unknown>>["onRowsDelete"]
  > = useCallback(
    (rows) => {
      setResourceAction({
        variant: "delete",
        data: rows[0],
      });
    },
    [setResourceAction],
  );

  const onCellUpdate = useCallback(
    async (updates: UpdateCell[]) => {
      if (!tableSchema || !data?.results) return;

      const primaryKeys = (tableSchema.primary_keys as PrimaryKey[]) ?? [];
      const jsonColumns = getJsonColumns(columnsSchema ?? []);

      // Group updates by row index
      const updatesByRow = updates.reduce(
        (acc, update) => {
          if (!acc[update.rowIndex]) {
            acc[update.rowIndex] = [];
          }
          acc[update.rowIndex].push(update);
          return acc;
        },
        {} as Record<number, UpdateCell[]>,
      );

      // Process each row's updates
      for (const [rowIndexStr, rowUpdates] of Object.entries(updatesByRow)) {
        const rowIndex = parseInt(rowIndexStr, 10);
        const rowData = data.results[rowIndex];

        if (!rowData) continue;

        // Build resource IDs from primary keys
        const resourceIds = primaryKeys.reduce(
          (acc, key) => {
            acc[key.name] = rowData[key.name];
            return acc;
          },
          {} as Record<string, unknown>,
        );

        // Build update data from the cell updates
        const updateData = rowUpdates.reduce(
          (acc, update) => {
            acc[update.columnId] = update.value;
            return acc;
          },
          {} as Record<string, unknown>,
        );

        // Parse JSON columns if needed
        const jsonInput = parseJsonColumns(updateData, jsonColumns);
        const finalData = { ...updateData, ...jsonInput };

        const { data: updatedData, error } = await updateResourceDataAction({
          schema: tableSchema.schema as DatabaseSchemas,
          resourceName: tableSchema.name as DatabaseTables<DatabaseSchemas>,
          resourceIds,
          data: finalData,
        });

        if (
          (!updatedData?.length && !error) ||
          error?.message.includes("row-level security policy")
        ) {
          window.location.reload();
          toast.error("You don't have permission to update this resource");
          return;
        }

        if (error) {
          window.location.reload();
          toast.error(error.message);
          return;
        }
      }
    },
    [tableSchema, data, columnsSchema],
  );

  const onFilesUpload = useCallback(
    async (params: {
      files: File[];
      rowIndex: number;
      columnId: string;
    }): Promise<FileCellData[]> => {
      if (!tableSchema) return [];

      const { files, columnId } = params;

      // Build storage path: {schema}/{table}/{column}
      const storagePath = `${tableSchema.schema}/${tableSchema.name}/${columnId}`;

      // Upload all files and collect results
      const uploadedFiles: FileCellData[] = [];

      for (const file of files) {
        try {
          const url = await uploadFileToStorage(client, file, storagePath);

          uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url,
            last_modified: new Date(file.lastModified).toISOString(),
          });
        } catch (error) {
          toast.error(
            `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }

      return uploadedFiles;
    },
    [client, tableSchema],
  );

  const onFilesDelete = useCallback(
    async (params: {
      fileIds: string[];
      rowIndex: number;
      columnId: string;
    }): Promise<void> => {
      const { fileIds } = params;

      // fileIds are URLs in our case
      for (const fileUrl of fileIds) {
        try {
          await deleteFileFromStorage(client, fileUrl);
        } catch (error) {
          toast.error(
            `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    },
    [client],
  );

  const {
    table,
    shallow,
    debounceMs,
    throttleMs,
    setFilters: _,
    joinOperator: __,
    setJoinOperator: ___,
    ...dataGridProps
  } = useDataGrid({
    columns,
    data: data?.results ?? [],
    pageCount: data ? Math.ceil(data.total / data.perPage) : -1,
    onDataChange: () => {},
    onRowsDelete,
    enableSearch: true,
    shallow: false, // Trigger server-side refetch on URL change
    clearOnDefault: true,
    onCellUpdate,
    onFilesUpload,
    onFilesDelete,
  });

  const height = Math.max(400, windowSize.height - 105);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <DataTableFilterList
            table={table}
            shallow={shallow}
            throttleMs={throttleMs}
            debounceMs={debounceMs}
          />
          <DataTableSortList table={table} />
        </div>
        <DataGridRowHeightMenu table={table} />
        <DataGridViewMenu table={table} />
      </div>
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={height} />
    </div>
  );
}

"use client";

import { useCallback, useMemo } from "react";

import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/interfaces/data-table/components/data-table-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import { useDataTable } from "@/interfaces/data-table/hooks/use-data-table";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import { ResourceDataSchema } from "@/lib/database-meta.types";

import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "../lib/loaders";
import { useResourceContext } from "./resource-context";
import { getResourceTableColumns } from "./resource-table-columns";
import { ResourceTableToolbarActions } from "./resource-table-toolbar-action";

export function ResourceTable({
  tableSchema,
  columnsSchema,
  data,
}: {
  tableSchema: Awaited<ReturnType<typeof loadTableSchema>> | null;
  columnsSchema: Awaited<ReturnType<typeof loadColumnsSchema>> | null;
  data: Awaited<ReturnType<typeof loadResourceData>> | null;
}) {
  const { setResourceAction } = useResourceContext();

  const columns = useMemo(
    () =>
      getResourceTableColumns({
        columnsSchema: columnsSchema ?? [],
        tableSchema,
        setRowAction: (
          rowAction: DataTableRowAction<ResourceDataSchema> | null,
        ) => {
          if (rowAction?.variant && rowAction?.row.original) {
            setResourceAction({
              variant: rowAction?.variant,
              data: rowAction?.row.original,
            });
          }
        },
      }),
    [columnsSchema, tableSchema, setResourceAction],
  );

  const getRowId = useCallback(
    (row: ResourceDataSchema) => row.id as string,
    [],
  );

  const { table, shallow, throttleMs, debounceMs } =
    useDataTable<ResourceDataSchema>({
      data: data.results,
      columns,
      pageCount: Math.ceil(data.total / data.perPage),
      columnResizeMode: "onChange",
      enableAdvancedFilter: true,
      enableColumnResizing: true,
      initialState: {
        columnPinning: { left: ["select"], right: ["actions"] },
      },
      getRowId,
      shallow: false,
      clearOnDefault: true,
    });

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList
            table={table}
            shallow={shallow}
            throttleMs={throttleMs}
            debounceMs={debounceMs}
          />
          <DataTableSortList table={table} />
          <ResourceTableToolbarActions
            table={table}
            columnsSchema={columnsSchema ?? []}
            tableSchema={tableSchema ?? null}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

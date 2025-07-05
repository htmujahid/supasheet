"use client";

import { use, useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { TableSchema } from "@/lib/database-meta.types";

import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "../lib/loaders";
import { getUserTableColumns } from "./user-table-columns";
import { UserTableToolbarActions } from "./user-table-toolbar-actions";

export function UsersTable({
  promises,
}: {
  promises: Promise<
    [
      Awaited<ReturnType<typeof loadTableSchema>>,
      Awaited<ReturnType<typeof loadColumnsSchema>>,
      Awaited<ReturnType<typeof loadResourceData>>,
    ]
  >;
}) {
  const [tableSchema, columnsSchema, data] = use(promises);

  const columns = useMemo(
    () =>
      getUserTableColumns({
        columnsSchema: columnsSchema ?? [],
        tableSchema,
      }),
    [columnsSchema, tableSchema],
  );

  const { table, shallow, throttleMs, debounceMs } = useDataTable<TableSchema>({
    data: data.results,
    columns,
    pageCount: Math.ceil(data.total / data.perPage),
    columnResizeMode: "onChange",
    enableAdvancedFilter: true,
    enableColumnResizing: true,
    initialState: {
      columnPinning: { left: ["select"], right: ["actions"] },
    },
    getRowId: (row) => row.id as string,
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
          <UserTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

"use client";

import { useMemo } from "react";

import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/interfaces/data-table/components/data-table-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import { useDataTable } from "@/interfaces/data-table/hooks/use-data-table";
import { ResourceDataSchema } from "@/lib/database-meta.types";

import { loadColumnsSchema, loadReportData } from "../lib/loaders";
import { getReportTableColumns } from "./report-table-columns";
import { ReportTableToolbarActions } from "./report-table-toolbar-action";

export function ReportTable({
  columnsSchema,
  data,
}: {
  columnsSchema: Awaited<ReturnType<typeof loadColumnsSchema>>;
  data: Awaited<ReturnType<typeof loadReportData>>;
}) {
  const columns = useMemo(
    () =>
      getReportTableColumns({
        columnsSchema: columnsSchema ?? [],
      }),
    [columnsSchema],
  );

  const { table, shallow, throttleMs, debounceMs } =
    useDataTable<ResourceDataSchema>({
      data: data.results,
      columns,
      pageCount: Math.ceil(data.total / data.perPage),
      columnResizeMode: "onChange",
      enableAdvancedFilter: true,
      enableColumnResizing: true,
      initialState: {},
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
          <ReportTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

"use client";

import { useMemo } from "react";

import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/interfaces/data-table/components/data-table-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import { useDataTable } from "@/interfaces/data-table/hooks/use-data-table";

import { loadAuditLogs } from "../lib/loaders";
import { AuditLogWithAccount } from "../lib/types";
import { auditLogTableColumns } from "./audit-log-table-columns";
import { AuditLogTableToolbarActions } from "./audit-log-table-toolbar-actions";

interface AuditLogTableProps {
  data: Awaited<ReturnType<typeof loadAuditLogs>>;
}

export function AuditLogTable({ data }: AuditLogTableProps) {
  const columns = useMemo(() => auditLogTableColumns, []);

  const { table, shallow, throttleMs, debounceMs } =
    useDataTable<AuditLogWithAccount>({
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
          <AuditLogTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

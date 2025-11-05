"use client";

import { useMemo } from "react";

import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/interfaces/data-table/components/data-table-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import { useDataTable } from "@/interfaces/data-table/hooks/use-data-table";

import { loadAccounts } from "../../lib/loaders";
import { Account } from "../../lib/types";
import { getAccountsTableColumns } from "./accounts-table-columns";
import { AccountsTableToolbarActions } from "./accounts-table-toolbar-actions";

type AccountsTableProps = {
  data: Awaited<ReturnType<typeof loadAccounts>>;
};

export function AccountsTable({ data }: AccountsTableProps) {
  const columns = useMemo(() => getAccountsTableColumns(), []);

  const { table, shallow, throttleMs, debounceMs } = useDataTable<Account>({
    data: data.results,
    columns,
    pageCount: Math.ceil(data.total / data.perPage),
    columnResizeMode: "onChange",
    enableAdvancedFilter: true,
    enableColumnResizing: true,
    initialState: {
      columnPinning: { left: ["select"] },
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
          <AccountsTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

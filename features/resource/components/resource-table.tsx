"use client";

import { use, useMemo, useState } from "react";

import { If } from "@/components/makerkit/if";
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
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceSheet } from "./resource-sheet";
import { getResourceTableColumns } from "./resource-table-columns";
import { ResourceTableToolbarActions } from "./resource-table-toolbar-action";

export function ResourceTable({
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
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<ResourceDataSchema> | null>(null);

  const columns = useMemo(
    () =>
      getResourceTableColumns({
        columnsSchema: columnsSchema ?? [],
        tableSchema,
        setRowAction,
      }),
    [columnsSchema, tableSchema, setRowAction],
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
          <ResourceTableToolbarActions
            table={table}
            columnsSchema={columnsSchema ?? []}
            tableSchema={tableSchema ?? null}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
      <If condition={rowAction?.variant === "delete" && tableSchema}>
        <DeleteResourceDialog
          open={rowAction?.variant === "delete"}
          onOpenChange={() => setRowAction(null)}
          resources={rowAction?.row.original ? [rowAction?.row.original] : []}
          tableSchema={tableSchema ?? null}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      </If>
      <If condition={rowAction?.variant === "update" && tableSchema}>
        <ResourceSheet
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={rowAction?.row.original ?? null}
        />
      </If>
    </div>
  );
}

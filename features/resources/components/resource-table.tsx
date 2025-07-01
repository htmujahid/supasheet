"use client";

import * as React from "react";

import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { Maximize2Icon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/features/resources/components/data-table/data-table";
import { DataTableColumnHeader } from "@/features/resources/components/data-table/data-table-column-header";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumnMeta } from "@/lib/data-table";
import { TableSchema } from "@/lib/database-meta.types";
import { DataTableRowAction } from "@/types/data-table";

import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "../lib/loaders";
import { DataTableAdvancedToolbar } from "./data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "./data-table/data-table-filter-list";
import { DataTableRowCell } from "./data-table/data-table-row-cell";
import { DataTableSortList } from "./data-table/data-table-sort-list";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceSheet } from "./resource-sheet";
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
  const [tableSchema, columnsSchema, data] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<TableSchema> | null>(null);

  const columns = React.useMemo<ColumnDef<TableSchema>[]>(
    () =>
      [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <div className="group flex items-center gap-2">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
              <Button
                variant="ghost"
                className="size-5 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  setRowAction({ row, variant: "update" });
                }}
              >
                <Maximize2Icon className="text-muted-foreground size-3" />
              </Button>
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
          size: 64,
          minSize: 64,
          enableResizing: false,
        },
        ...(columnsSchema ?? []).map((c) => ({
          id: c.name,
          accessorKey: c.name as string,
          header: ({ column }: { column: Column<TableSchema, unknown> }) => (
            <DataTableColumnHeader
              column={column}
              columnSchema={c}
              tableSchema={tableSchema ?? null}
              title={c.name as string}
            />
          ),
          cell: ({ row }: { row: Row<TableSchema> }) => (
            <DataTableRowCell
              row={row}
              column={c}
              tableSchema={tableSchema ?? null}
            />
          ),
          size: 170,
          enableColumnFilter: true,
          meta: getColumnMeta(c),
          enableSorting: true,
          enableHiding: true,
        })),
      ] as ColumnDef<TableSchema, unknown>[],
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
          <ResourceTableToolbarActions
            table={table}
            columnsSchema={columnsSchema ?? []}
            tableSchema={tableSchema ?? null}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
      <If condition={rowAction?.variant === "delete"}>
        <DeleteResourceDialog
          open={rowAction?.variant === "delete"}
          onOpenChange={() => setRowAction(null)}
          resources={rowAction?.row.original ? [rowAction?.row.original] : []}
          tableSchema={tableSchema ?? null}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      </If>
      <If condition={rowAction?.variant === "update"}>
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

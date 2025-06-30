"use client";

import * as React from "react";

import Link from "next/link";

import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpRightIcon, Maximize2Icon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/features/resources/components/data-table/data-table";
import { DataTableColumnHeader } from "@/features/resources/components/data-table/data-table-column-header";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumnMeta } from "@/lib/data-table";
import {
  PaginatedData,
  Relationship,
  TableSchema,
} from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { DataTableRowAction } from "@/types/data-table";

import { DataTableAdvancedToolbar } from "./data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "./data-table/data-table-filter-list";
import { DataTableSortList } from "./data-table/data-table-sort-list";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceSheet } from "./resource-sheet";
import { ResourceTableToolbarActions } from "./resource-table-toolbar-action";

export function ResourceTable({
  tableSchema,
  columnsSchema,
  data,
}: {
  tableSchema: Tables<"_pg_meta_tables"> | null;
  columnsSchema: Tables<"_pg_meta_columns">[];
  data: PaginatedData<TableSchema>;
}) {
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
        ...columnsSchema.map((c) => ({
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
            <div
              className={cn(
                "relative truncate",
                c.name === "account_id" && "pl-6",
              )}
            >
              {row.original?.[c.name as keyof TableSchema]?.toString()}
              <If condition={c.name === "account_id"}>
                <Link
                  href={prepareForeignKeyLink(
                    c.name as string,
                    row.original?.[c.name as keyof TableSchema]?.toString() ??
                      "",
                    getColumnMeta(c).variant,
                    tableSchema ?? null,
                  )}
                  className="absolute top-1/2 left-0 -translate-y-1/2 transform"
                >
                  <ArrowUpRightIcon className="size-3" />
                </Link>
              </If>
            </div>
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
            columnsSchema={columnsSchema}
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
          columnsSchema={columnsSchema}
          data={rowAction?.row.original ?? null}
        />
      </If>
    </div>
  );
}

function prepareForeignKeyLink(
  key: string,
  value: string,
  variant: string,
  table: Tables<"_pg_meta_tables"> | null,
) {
  if (!table) return "#";

  const relationships = table.relationships as Relationship[];

  const relationship = relationships.find((r) => r.source_column_name === key);

  if (!relationship) return "#";

  return `/home/resources/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"${variant}","operator":"eq","filterId":"0QdV0twS"}]`;
}

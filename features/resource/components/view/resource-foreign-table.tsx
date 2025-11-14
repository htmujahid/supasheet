"use client";

import { useMemo } from "react";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import type {
  TableSchema,
  ColumnSchema,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

import { getResourceForeignDataColumns } from "./resource-foreign-data-columns";
import { ResourceSheet } from "../resource-sheet";
import { useResourceContext } from "../resource-context";


type ResourceForeignTableProps = {
  relationship: TableSchema & { columns: ColumnSchema[] };
  data: ResourceDataSchema[] | null;
};

export function ResourceForeignTable({
  relationship,
  data,
}: ResourceForeignTableProps) {
  const { setResourceAction } = useResourceContext();

  const columns = useMemo(
    () =>
      getResourceForeignDataColumns({
        data: data ?? [],
        columnsSchema: relationship.columns ?? [],
        tableSchema: relationship as unknown as TableSchema,
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
    [relationship, data, setResourceAction],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.length ?? 0,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table} isPagination={false} className="[&>div>div]:h-auto">
        <DataTableAdvancedToolbar table={table}>
          <ResourceSheet
            create
            showTrigger
            tableSchema={relationship}
            columnsSchema={relationship.columns}
            data={null}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}

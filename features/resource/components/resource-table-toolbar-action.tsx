"use client";

import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { exportTableToCSV } from "@/lib/export";

import { DeleteResourceDialog } from "./delete-resource-dialog";
import { useResourceContext } from "./resource-context";

type ResourceTableToolbarActionsProps = {
  table: Table<ResourceDataSchema>;
  columnsSchema: ColumnSchema[];
  tableSchema: TableSchema | null;
};

export function ResourceTableToolbarActions({
  table,
  columnsSchema,
  tableSchema,
}: ResourceTableToolbarActionsProps) {
  const { permissions } = useResourceContext();

  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 &&
      tableSchema &&
      permissions.canDelete ? (
        <DeleteResourceDialog
          tableSchema={tableSchema}
          columnSchema={columnsSchema}
          resources={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}

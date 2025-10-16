"use client";

import { useState } from "react";

import type { Table } from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { exportTableToCSV } from "@/lib/export";
import { formatTitle } from "@/lib/format";

import { DeleteResourceDialog } from "./delete-resource-dialog";
import { useResourceContext } from "./resource-context";
import { ResourceSheet } from "./resource-sheet";

interface ResourceTableToolbarActionsProps {
  table: Table<ResourceDataSchema>;
  columnsSchema: ColumnSchema[];
  tableSchema: TableSchema | null;
}

export function ResourceTableToolbarActions({
  table,
  columnsSchema,
  tableSchema,
}: ResourceTableToolbarActionsProps) {
  const { permissions } = useResourceContext();
  const [open, setOpen] = useState(false);

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
      <If condition={tableSchema && permissions.canInsert}>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus />
          Create {formatTitle(tableSchema?.name as string) || "Resource"}
        </Button>
      </If>
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
      <ResourceSheet
        tableSchema={tableSchema}
        columnsSchema={columnsSchema}
        data={null}
        open={open}
        onOpenChange={setOpen}
      />
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}

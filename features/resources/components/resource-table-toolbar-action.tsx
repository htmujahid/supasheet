"use client";

import { useState } from "react";

import type { Table } from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { exportTableToCSV } from "@/lib/export";

import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceSheet } from "./resource-sheet";

interface ResourceTableToolbarActionsProps {
  table: Table<TableSchema>;
  columnsSchema: Tables<"_pg_meta_columns">[];
  tableSchema: Tables<"_pg_meta_tables"> | null;
}

export function ResourceTableToolbarActions({
  table,
  columnsSchema,
  tableSchema,
}: ResourceTableToolbarActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteResourceDialog
          tableSchema={tableSchema}
          resources={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus />
        New {tableSchema?.name as string || "Resource"}
      </Button>
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
        tableSchema={null}
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

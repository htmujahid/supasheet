"use client";

import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSchema } from "@/lib/database-meta.types";
import { exportTableToCSV } from "@/lib/export";

export function UserTableToolbarActions({
  table,
}: {
  table: Table<TableSchema>;
}) {
  return (
    <div className="flex flex-1 items-center justify-end gap-2">
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

"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import { AuditLogWithAccount } from "../lib/types";

type AuditLogTableToolbarActionsProps = {
  table: Table<AuditLogWithAccount>;
};

export function AuditLogTableToolbarActions({
  table,
}: AuditLogTableToolbarActionsProps) {
  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "audit-logs",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
    </div>
  );
}

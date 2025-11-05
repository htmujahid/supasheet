"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import { Account } from "../../lib/types";

export function AccountsTableToolbarActions({
  table,
}: {
  table: Table<Account>;
}) {
  return (
    <div className="flex flex-1 items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "users",
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

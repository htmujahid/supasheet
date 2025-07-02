import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { Maximize2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { DataTableRowAction } from "@/types/data-table";

import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { DataTableRowCell } from "./data-table/data-table-row-cell";
import { getColumnMeta } from "./data-table/utils";

export function getResourceTableColumns({
  columnsSchema,
  tableSchema,
  setRowAction,
}: {
  columnsSchema: Tables<"_pg_meta_columns">[];
  tableSchema: Tables<"_pg_meta_tables"> | null;
  setRowAction: (rowAction: DataTableRowAction<TableSchema> | null) => void;
}) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
          setRowAction={setRowAction}
        />
      ),
      size: 170,
      enableColumnFilter: true,
      meta: getColumnMeta(c),
      enableSorting: true,
      enableHiding: true,
    })),
  ] as ColumnDef<TableSchema, unknown>[];
}

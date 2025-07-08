import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { EyeIcon, Maximize2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ResourceColumnHeader } from "@/features/resources/components/resource-column-header";
import { ResourceRowCell } from "@/features/resources/components/resource-row-cell";
import { getColumnMeta } from "@/features/resources/lib/columns";
import { PrimaryKey, TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { DataTableRowAction } from "@/types/data-table";
import Link from "next/link";

export function getResourceTableColumns({
  columnsSchema,
  tableSchema,
  setRowAction,
}: {
  columnsSchema: Tables<"_pg_meta_columns">[];
  tableSchema: Tables<"_pg_meta_tables"> | null;
  setRowAction: (rowAction: DataTableRowAction<TableSchema> | null) => void;
}) {
  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[] ?? [];

  return [
    ...(tableSchema
      ? [
          {
            id: "select",
            header: ({ table }: { table: Table<TableSchema> }) => (
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
            cell: ({ row }: { row: Row<TableSchema> }) => (
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
                <Button
                  variant="ghost"
                  className="ml-1 size-5 opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    setRowAction({ row, variant: "update" });
                  }}
                >
                  <Maximize2Icon className="text-muted-foreground size-3" />
                </Button>
                <Link
                  href={`/home/resources/${tableSchema.name}/${primaryKeys.map(key => row.original?.[key.name as keyof TableSchema]?.toString() ?? "").join("/")}`}
                >
                  <Button variant="ghost" className="size-5 opacity-0 group-hover:opacity-100">
                    <EyeIcon className="text-muted-foreground size-3" />
                  </Button>
                </Link>
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 94,
            minSize: 94,
            enableResizing: false,
          },
        ]
      : []),
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: ({ column }: { column: Column<TableSchema, unknown> }) => (
        <ResourceColumnHeader
          column={column}
          columnSchema={c}
          tableSchema={tableSchema ?? null}
          title={c.name as string}
        />
      ),
      cell: ({ row }: { row: Row<TableSchema> }) => (
        <ResourceRowCell
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

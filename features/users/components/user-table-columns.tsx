import { Column, ColumnDef, Row } from "@tanstack/react-table";

import { TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

import { getColumnMeta } from "../lib/columns";
import { UserColumnHeader } from "./user-column-header";
import { UserRowCell } from "./user-row-cell";

export function getUserTableColumns({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: Tables<"_pg_meta_columns">[];
  tableSchema: Tables<"_pg_meta_tables"> | null;
}) {
  return [
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: ({ column }: { column: Column<TableSchema, unknown> }) => (
        <UserColumnHeader
          column={column}
          columnSchema={c}
          tableSchema={tableSchema ?? null}
          title={c.name as string}
        />
      ),
      cell: ({ row }: { row: Row<TableSchema> }) => (
        <UserRowCell row={row} column={c} tableSchema={tableSchema ?? null} />
      ),
      size: 170,
      enableColumnFilter: true,
      meta: getColumnMeta(c),
      enableSorting: true,
      enableHiding: true,
    })),
  ] as ColumnDef<TableSchema, unknown>[];
}

import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { Link2Icon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { ResourceColumnHeader } from "@/features/resource/components/resource-column-header";
import { ResourceRowCell } from "@/features/resource/components/resource-row-cell";
import { getColumnFilterData } from "@/features/resource/lib/columns";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableMetadata,
  TableSchema,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

import { useResourceContext } from "./resource-context";
import { ResourceTableRowActions } from "./resource-table-row-actions";

export function getResourceTableColumns({
  columnsSchema,
  tableSchema,
  setRowAction,
}: {
  columnsSchema: ColumnSchema[];
  tableSchema: TableSchema | null;
  setRowAction: (
    rowAction: DataTableRowAction<ResourceDataSchema> | null,
  ) => void;
}) {
  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;

  const joinedColumns: `${string}.${string}`[] = (
    tableMeta.query?.join ?? []
  ).flatMap((join) =>
    join.columns.map((col) => `${join.table}.${col}` as const),
  );

  return [
    ...(tableSchema
      ? [
          {
            id: "select",
            header: ({ table }: { table: Table<ResourceDataSchema> }) => (
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
            cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
            minSize: 40,
            enableResizing: false,
          },
        ]
      : []),
    ...joinedColumns.map((col) => ({
      id: col,
      accessorKey: col,
      header: () => (
        <div className="flex items-center gap-2 truncate">
          <Link2Icon className="text-muted-foreground size-4 shrink-0" />
          <span className="">{formatTitle(col.replace(".", "_"))}</span>
        </div>
      ),
      size: 170,
      enableHiding: true,
    })),
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: ({ column }: { column: Column<ResourceDataSchema, unknown> }) => (
        <ResourceColumnHeader
          column={column}
          columnSchema={c}
          tableSchema={tableSchema ?? null}
          title={c.name as string}
        />
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          columnSchema={c}
          tableSchema={tableSchema ?? null}
          setRowAction={setRowAction}
        />
      ),
      size: 170,
      enableColumnFilter: true,
      meta: getColumnFilterData(c),
      enableSorting: true,
      enableHiding: true,
    })),
    ...(tableSchema
      ? [
          {
            id: "actions",
            cell: function Cell({ row }: { row: Row<ResourceDataSchema> }) {
              const { permissions } = useResourceContext();
              if (
                !permissions.canSelect &&
                !permissions.canUpdate &&
                !permissions.canDelete
              ) {
                return null;
              }
              return (
                <ResourceTableRowActions
                  row={row}
                  tableSchema={tableSchema}
                  setRowAction={setRowAction}
                />
              );
            },
            size: 40,
          },
        ]
      : []),
  ] as ColumnDef<ResourceDataSchema, unknown>[];
}

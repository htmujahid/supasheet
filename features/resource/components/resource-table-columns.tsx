import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { ResourceColumnHeader } from "@/features/resource/components/resource-column-header";
import { ResourceRowCell } from "@/features/resource/components/resource-row-cell";
import { getColumnMeta } from "@/features/resource/lib/columns";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { ResourceTableRowActions } from "./resource-table-row-actions";
import { useResourceContext } from "./resource-context";

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
      meta: getColumnMeta(c),
      enableSorting: true,
      enableHiding: true,
    })),
    ...(tableSchema
      ? [
          {
            id: "actions",
            cell: function Cell({ row }: { row: Row<ResourceDataSchema> }) {
              const { permissions } = useResourceContext();
              if (!permissions.canSelect && !permissions.canUpdate && !permissions.canDelete) {
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

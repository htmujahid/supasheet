import { ColumnDef, Row } from "@tanstack/react-table";

import { ResourceRowCell } from "@/features/resource/components/resource-row-cell";
import { getColumnFilterData } from "@/features/resource/lib/columns";
import {
  ColumnSchema,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";

export function getResourceForeignDataColumns({
  columnsSchema,
  tableSchema,
  data,
  setRowAction,
}: {
  columnsSchema: ColumnSchema[];
  tableSchema: TableSchema;
  data: ResourceDataSchema[];
  setRowAction: (
    rowAction: DataTableRowAction<ResourceDataSchema> | null,
  ) => void;
}) {
  return [
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: () => (
        <div className="truncate select-none">{formatTitle(c.name as string)}</div>
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ResourceRowCell
          row={row}
          columnSchema={c}
          tableSchema={tableSchema ?? null}
          setRowAction={setRowAction}
        />
      ),
      size: 150,
      enableColumnFilter: true,
      meta: getColumnFilterData(c),
      enableSorting: true,
      enableHiding: true,
    })),
    ...(
      data.length > 0
        ? Object.keys(data[0]).map((key) => {
          const existingColumn = columnsSchema.find((c) => c.name === key);
          if (existingColumn) {
            return null;
          }
          return {
            id: key,
            accessorKey: key,
            header: () => (
              <div className="truncate select-none">{formatTitle(key)}</div>
            ),
            cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
              <ResourceRowCell
                row={row}
                columnSchema={{ id: key, name: key} as ColumnSchema}
                tableSchema={tableSchema ?? null}
                setRowAction={() => {
                  // No-op for embedded view
                }}
              />
            ),
            size: 150,
            enableColumnFilter: false,
            enableSorting: true,
            enableHiding: true,
          } as ColumnDef<ResourceDataSchema, unknown>;
        })
        : []
    ).filter((c) => c !== null)
  ] as ColumnDef<ResourceDataSchema, unknown>[];
}

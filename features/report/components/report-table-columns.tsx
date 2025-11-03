import { Column, ColumnDef, Row } from "@tanstack/react-table";

import { getColumnFilterData } from "@/features/resource/lib/columns";
import { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

import { ReportColumnHeader } from "./report-column-header";
import { ReportRowCell } from "./report-row-cell";

export function getReportTableColumns({
  columnsSchema,
}: {
  columnsSchema: ColumnSchema[];
}) {
  return [
    ...(columnsSchema ?? []).map((c) => ({
      id: c.name,
      accessorKey: c.name as string,
      header: ({ column }: { column: Column<ResourceDataSchema, unknown> }) => (
        <ReportColumnHeader
          column={column}
          columnSchema={c}
          tableSchema={null}
          title={c.name as string}
        />
      ),
      cell: ({ row }: { row: Row<ResourceDataSchema> }) => (
        <ReportRowCell row={row} columnSchema={c} />
      ),
      size: 170,
      enableColumnFilter: true,
      meta: getColumnFilterData(c),
      enableSorting: true,
      enableHiding: true,
    })),
  ] as ColumnDef<ResourceDataSchema, unknown>[];
}

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/interfaces/data-table/components/data-table";
import { useDataTable } from "@/interfaces/data-table/hooks/use-data-table";
import { ResourceDataSchema } from "@/lib/database-meta.types";
import { exportTableToCSV } from "@/lib/export";

import { SqlColumnHeader } from "./sql-column-header";
import { useSqlContext } from "./sql-context";
import { SqlRowCell } from "./sql-row-cell";

export function SqlTable() {
  // Extract column names dynamically from the first data row
  const id = useParams<{ id: string }>().id;
  const { data } = useSqlContext();

  const columns = useMemo(
    () =>
      data.length > 0
        ? (Object.keys(data[0]).map((key) => ({
          accessorKey: key,
          header: ({ column }) => {
            return <SqlColumnHeader column={column} title={key} />;
          },
          cell: ({ row }) => {
            return <SqlRowCell row={row} title={key} />;
          },
        })) as ColumnDef<ResourceDataSchema, unknown>[])
        : [],
    [data],
  );

  const { table } = useDataTable<ResourceDataSchema>({
    data: data,
    columns,
    pageCount: 1,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    enableSorting: false,
    getRowId: (row) => row.id as string,
    shallow: false,
    clearOnDefault: true,
  });

  if (!data || data.length === 0) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="data-table-container [&>div>div>div]:!h-[calc(80vh-106px)] px-4 py-2 space-y-2">
      <div className="flex justify-between gap-2 items-center">
        <div className="text-base font-medium">Results</div>
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: `sql-query-${id}`,
                excludeColumns: ["select", "actions"],
              })
            }
          >
            <Download />
            Export
          </Button>
        </div>
      </div>
      <DataTable table={table} isPagination={false} />
    </div>
  );
}

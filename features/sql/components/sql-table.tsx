import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import { TableSchema } from "@/lib/database-meta.types";
import { exportTableToCSV } from "@/lib/export";

import { SqlColumnHeader } from "./sql-column-header";
import { useSqlContext } from "./sql-context";
import { SqlRowCell } from "./sql-row-cell";

export function SqlTable() {
  // Extract column names dynamically from the first data row
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
          })) as ColumnDef<TableSchema, unknown>[])
        : [],
    [data],
  );

  const { table } = useDataTable<TableSchema>({
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
    return <div>No data available</div>;
  }

  return (
    <div className="data-table-container [&>div>div>div]:!h-[calc(80vh-190px)]">
      <DataTable table={table} isPagination={false}>
        <div className="flex h-8 justify-between gap-2">
          <div className="pt-1 text-base font-medium">Results</div>
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportTableToCSV(table, {
                  filename: "tasks",
                  excludeColumns: ["select", "actions"],
                })
              }
            >
              <Download />
              Export
            </Button>
          </div>
        </div>
      </DataTable>
    </div>
  );
}

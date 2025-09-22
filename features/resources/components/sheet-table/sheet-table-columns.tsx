import { ColumnDef } from "@tanstack/react-table";

import { getColumnCell, getColumnMeta } from "@/features/resources/lib/columns";
import { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

export function getSheetTableColumns({
  columnsSchema,
  setRecord,
}: {
  columnsSchema: ColumnSchema[];
  setRecord: (record: ResourceDataSchema) => void;
}) {
  return (columnsSchema ?? []).map((c) => ({
    id: c.name,
    accessorKey: c.name as string,
    header: () => (
      <div className="truncate select-none">{c.name as string}</div>
    ),
    cell: ({ row }) => {
      const cell = getColumnCell(c);

      if (cell === "json" || cell === "array") {
        return (
          <pre
            className="truncate select-none"
            onClick={() => {
              setRecord(row.original);
            }}
          >
            {JSON.stringify(
              row.original?.[c.name as keyof ResourceDataSchema],
              null,
              2,
            )}
          </pre>
        );
      }

      return (
        <div
          className="truncate select-none"
          onClick={() => {
            setRecord(row.original);
          }}
        >
          {row.original[c.name as keyof ResourceDataSchema] as string}
        </div>
      );
    },
    size: 150,
    enableColumnFilter: true,
    meta: getColumnMeta(c),
    enableSorting: true,
    enableHiding: true,
  })) as ColumnDef<ResourceDataSchema, unknown>[];
}

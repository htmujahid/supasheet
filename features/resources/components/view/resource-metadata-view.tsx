import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tables } from "@/lib/database.types";

export function ResourceMetadataView({
  columnsSchema,
  singleResourceData,
}: {
  columnsSchema: Tables<"_pg_meta_columns">[];
  singleResourceData: Record<string, unknown>;
}) {

  const metadataColumns =
    columnsSchema?.filter((column) =>
      ["created_at", "updated_at"].includes(column.name as string),
    ) ?? [];

  if (!metadataColumns.length) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-base font-medium">Metadata</h3>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            {metadataColumns.map((column) => {
              const value =
                singleResourceData?.[
                column.name as keyof typeof singleResourceData
                ];
              return (
                <TableRow
                  key={column.id}
                  className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                >
                  <TableCell className="bg-muted/50 w-1/4 py-2 font-medium">
                    {column.name as string}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-muted-foreground text-sm">
                      {value
                        ? new Date(value as string).toLocaleString()
                        : ""}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tables } from "@/lib/database.types";

export function ResourceDetailView({
  columnsSchema,
  singleResourceData,
}: {
  columnsSchema: Tables<"_pg_meta_columns">[];
  singleResourceData: Record<string, unknown>;
}) {
  // Separate columns into different categories
  const detailColumns =
    columnsSchema?.filter((column) => {
      return !["created_at", "updated_at"].includes(
        column.name as string,
      );
    }) ?? [];

  return (
    <div className="space-y-2.5">
      <h3 className="text-base font-medium">Details</h3>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            {detailColumns.map((column) => {
              let value =
                singleResourceData?.[
                column.name as keyof typeof singleResourceData
                ] ?? "";

              if (typeof value === "object" && value !== null) {
                value = JSON.stringify(value);
              }
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
                      {String(value ?? "") as string}
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
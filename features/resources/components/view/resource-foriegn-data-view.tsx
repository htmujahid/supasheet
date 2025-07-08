import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tables } from "@/lib/database.types";
import { Relationship } from "@/lib/database-meta.types";
import { ExternalLinkIcon } from "lucide-react";

export function ResourceForiegnDataView({
  tableSchema,
  singleResourceData,
}: {
  tableSchema: Tables<"_pg_meta_tables">;
  singleResourceData: Record<string, unknown>;
}) {
  const relationships = (tableSchema?.relationships as Relationship[]) ?? [];

  const refineRelationships = relationships.filter(relationship => relationship.target_table_schema === 'public');

  if (refineRelationships.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-base font-medium">Related Data</h3>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            {refineRelationships.map((relationship) => {
              let value = singleResourceData?.[relationship.source_column_name as keyof typeof singleResourceData];
              const isValue = !!value;
              let link = `/home/resources/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"text","operator":"eq","filterId":"${relationship.id}"}]`;

              if (!value) {
                value = singleResourceData?.[relationship.target_column_name as keyof typeof singleResourceData];
                link = `/home/resources/${relationship.source_table_name}?filters=[{"id":"${relationship.source_column_name}","value":"${value}","variant":"text","operator":"eq","filterId":"${relationship.id}"}]`
              }
              return (
                <TableRow
                  key={relationship.id}
                  className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                >
                  <TableCell className="bg-muted/50 w-1/4 py-2 font-medium">
                  {isValue ? relationship.target_table_name : relationship.source_table_name}
                  </TableCell>
                  <TableCell className="py-2">
                    <Link
                      href={link}
                      className="text-primary hover:underline text-sm flex items-center gap-2"
                    >
                      <ExternalLinkIcon className="size-4" />
                      {String(value ?? "N/A")} 
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { getColumnCell, getColumnMeta } from "@/lib/data-table";
import { Relationship, TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export function DataTableRowCell({
  row,
  column,
  tableSchema,
}: {
  row: Row<TableSchema>;
  column: Tables<"_pg_meta_columns">;
  tableSchema: Tables<"_pg_meta_tables"> | null;
}) {
  const meta = getColumnMeta(column);
  const cell = getColumnCell(column);

  if (cell === "json") {
    return (
      <pre className="truncate">
        {JSON.stringify(
          row.original?.[column.name as keyof TableSchema],
          null,
          2,
        )}
      </pre>
    );
  }

  return (
    <div
      className={cn(
        "relative truncate",
        column.name === "account_id" && "pl-6",
      )}
    >
      {row.original?.[column.name as keyof TableSchema]?.toString()}
      <If condition={column.name === "account_id"}>
        <Link
          href={prepareForeignKeyLink(
            column.name as string,
            row.original?.[column.name as keyof TableSchema]?.toString() ?? "",
            meta.variant,
            tableSchema ?? null,
          )}
          className="absolute top-1/2 left-0 -translate-y-1/2 transform"
        >
          <ArrowUpRightIcon className="size-3" />
        </Link>
      </If>
    </div>
  );
}

function prepareForeignKeyLink(
  key: string,
  value: string,
  variant: string,
  table: Tables<"_pg_meta_tables"> | null,
) {
  if (!table) return "#";

  const relationships = table.relationships as Relationship[];

  const relationship = relationships.find((r) => r.source_column_name === key);

  if (!relationship) return "#";

  return `/home/resources/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"${variant}","operator":"eq","filterId":"0QdV0twS"}]`;
}

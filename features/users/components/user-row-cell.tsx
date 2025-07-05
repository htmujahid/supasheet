import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { ArrowUpRightIcon, CopyIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getColumnCell, getColumnMeta } from "@/features/resources/lib/columns";
import { Relationship, TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export function UserRowCell({
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

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (r) => r.source_column_name === column.name,
  );

  if (cell === "json" || cell === "array") {
    return (
      <pre className="truncate">
        {JSON.stringify(
          row.original?.[column.name as keyof TableSchema],
          null,
          0,
        )}
      </pre>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "relative truncate select-none",
            relationship && "pl-6",
          )}
        >
          {row.original?.[column.name as keyof TableSchema]?.toString()}
          <If condition={relationship}>
            <Link
              href={prepareForeignKeyLink(
                column.name as string,
                row.original?.[column.name as keyof TableSchema]?.toString() ??
                  "",
                meta.variant,
                tableSchema ?? null,
              )}
              className="absolute top-1/2 left-0 -translate-y-1/2 transform rounded border p-0.5"
            >
              <ArrowUpRightIcon className="size-3" />
            </Link>
          </If>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(
              row.original?.[column.name as keyof TableSchema]?.toString() ??
                "",
            );
          }}
        >
          <CopyIcon className="size-4" />
          Copy Cell Content
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
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

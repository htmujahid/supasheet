import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { ArrowUpRightIcon, CopyIcon, EditIcon, TrashIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Relationship, TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { DataTableRowAction } from "@/types/data-table";

import { getColumnCell, getColumnMeta } from "./utils";

export function DataTableRowCell({
  row,
  column,
  tableSchema,
  setRowAction,
}: {
  row: Row<TableSchema>;
  column: Tables<"_pg_meta_columns">;
  tableSchema: Tables<"_pg_meta_tables"> | null;
  setRowAction: (action: DataTableRowAction<TableSchema> | null) => void;
}) {
  const meta = getColumnMeta(column);
  const cell = getColumnCell(column);

  const relationship = (tableSchema?.relationships as Relationship[]).find(
    (r) => r.source_column_name === column.name,
  );

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
              className="absolute top-1/2 left-0 -translate-y-1/2 transform border p-0.5 rounded"
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
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() =>
            setRowAction({
              variant: "update",
              row: row,
            })
          }
        >
          <EditIcon className="size-4" />
          Edit Row
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          onClick={() =>
            setRowAction({
              variant: "delete",
              row: row,
            })
          }
        >
          <TrashIcon className="size-4" />
          Delete Row
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

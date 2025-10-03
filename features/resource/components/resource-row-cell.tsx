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
import { getColumnCell, getColumnMeta } from "@/features/resource/lib/columns";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  ColumnSchema,
  Relationship,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

export function ResourceRowCell({
  row,
  column,
  tableSchema,
  setRowAction,
}: {
  row: Row<ResourceDataSchema>;
  column: ColumnSchema;
  tableSchema: TableSchema | null;
  setRowAction: (action: DataTableRowAction<ResourceDataSchema> | null) => void;
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
          row.original?.[column.name as keyof ResourceDataSchema],
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
          {row.original?.[column.name as keyof ResourceDataSchema]?.toString()}
          <If condition={relationship}>
            <Link
              href={prepareForeignKeyLink(
                column.name as string,
                row.original?.[
                  column.name as keyof ResourceDataSchema
                ]?.toString() ?? "",
                meta.variant,
                tableSchema ?? null,
              )}
              target="_blank"
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
              row.original?.[
                column.name as keyof ResourceDataSchema
              ]?.toString() ?? "",
            );
          }}
        >
          <CopyIcon className="size-4" />
          Copy Cell Content
        </ContextMenuItem>
        <If condition={tableSchema}>
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
        </If>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function prepareForeignKeyLink(
  key: string,
  value: string,
  variant: string,
  table: TableSchema | null,
) {
  if (!table) return "#";

  const relationships = table.relationships as Relationship[];

  const relationship = relationships.find((r) => r.source_column_name === key);

  if (!relationship) return "#";

  return `/home/resource/${relationship.target_table_schema}/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"${variant}","operator":"eq","filterId":"0QdV0twS"}]`;
}

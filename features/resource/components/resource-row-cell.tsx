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
import { getColumnMetadata } from "@/features/resource/lib/columns";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  ColumnSchema,
  Relationship,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

import { AllCells } from "./cells/all-cells";
import { ArrayCell } from "./cells/array-cell";

export function ResourceRowCell({
  row,
  columnSchema,
  tableSchema,
  setRowAction,
}: {
  row: Row<ResourceDataSchema>;
  columnSchema: ColumnSchema;
  tableSchema: TableSchema | null;
  setRowAction: (action: DataTableRowAction<ResourceDataSchema> | null) => void;
}) {
  const columnData = getColumnMetadata(columnSchema);

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (r) => r.source_column_name === columnSchema.name,
  );

  const value = row.original?.[columnSchema.name as keyof ResourceDataSchema];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "relative truncate select-none",
            relationship && "pl-6",
          )}
        >
          {columnData.isArray ? (
            <ArrayCell value={value as any[]} />
          ) : (
            <AllCells columnMetadata={columnData} value={value} />
          )}
          {/* {value?.toString()} */}
          <If condition={relationship}>
            <Link
              href={prepareForeignKeyLink(
                columnSchema.name as string,
                row.original?.[
                  columnSchema.name as keyof ResourceDataSchema
                ]?.toString() ?? "",
                columnData.type,
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
              row.original ? JSON.stringify(row.original, null, 2) : "",
            );
          }}
        >
          <CopyIcon className="size-4" />
          Copy Row
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(
              row.original?.[
                columnSchema.name as keyof ResourceDataSchema
              ]?.toString() ?? "",
            );
          }}
        >
          <CopyIcon className="size-4" />
          Copy Cell Content
        </ContextMenuItem>
        <If condition={tableSchema}>
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
          <ContextMenuSeparator />
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
  tableSchema: TableSchema | null,
) {
  if (!tableSchema) return "#";

  const relationships = tableSchema.relationships as Relationship[];

  const relationship = relationships.find((r) => r.source_column_name === key);

  if (!relationship) return "#";

  return `/home/resource/${relationship.target_table_schema}/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"${variant}","operator":"eq","filterId":"0QdV0twS"}]`;
}

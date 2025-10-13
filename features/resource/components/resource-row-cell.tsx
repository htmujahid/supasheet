import { memo, useCallback, useMemo } from "react";

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
import { useResourceContext } from "./resource-context";

export const ResourceRowCell = memo(function ResourceRowCell({
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
  // Memoize expensive calculations to avoid recalculating on every render
  const columnData = useMemo(
    () => getColumnMetadata(columnSchema),
    [columnSchema],
  );
  const { permissions } = useResourceContext();

  const relationship = useMemo(
    () =>
      (tableSchema?.relationships as Relationship[])?.find(
        (r) => r.source_column_name === columnSchema.name,
      ),
    [tableSchema?.relationships, columnSchema.name],
  );

  const value = row.original?.[columnSchema.name as keyof ResourceDataSchema];

  // Memoize onClick handlers to avoid creating new functions on every render
  const handleCopyRow = useCallback(() => {
    navigator.clipboard.writeText(
      row.original ? JSON.stringify(row.original, null, 2) : "",
    );
  }, [row.original]);

  const handleCopyCell = useCallback(() => {
    navigator.clipboard.writeText(value?.toString() ?? "");
  }, [value]);

  const handleEdit = useCallback(() => {
    setRowAction({
      variant: "update",
      row: row,
    });
  }, [setRowAction, row]);

  const handleDelete = useCallback(() => {
    setRowAction({
      variant: "delete",
      row: row,
    });
  }, [setRowAction, row]);

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
        <ContextMenuItem onClick={handleCopyRow}>
          <CopyIcon className="size-4" />
          Copy Row
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopyCell}>
          <CopyIcon className="size-4" />
          Copy Cell Content
        </ContextMenuItem>
        <If condition={tableSchema}>
          <If condition={permissions.canUpdate}>
            <ContextMenuItem onClick={handleEdit}>
              <EditIcon className="size-4" />
              Edit Row
            </ContextMenuItem>
          </If>
          <If condition={permissions.canDelete}>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" onClick={handleDelete}>
              <TrashIcon className="size-4" />
              Delete Row
            </ContextMenuItem>
          </If>
        </If>
      </ContextMenuContent>
    </ContextMenu>
  );
});

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

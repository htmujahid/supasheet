import { memo, useCallback, useMemo } from "react";

import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { EditIcon, EllipsisIcon, TrashIcon, ViewIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import {
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { useResourceContext } from "./resource-context";

export const ResourceTableRowActions = memo(function ResourceTableRowActions({
  row,
  tableSchema,
  setRowAction,
}: {
  row: Row<ResourceDataSchema>;
  tableSchema: TableSchema;
  setRowAction: (
    rowAction: DataTableRowAction<ResourceDataSchema> | null,
  ) => void;
}) {
  const { permissions } = useResourceContext();
  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  // Memoize href calculations to avoid recreating on every render
  const viewHref = useMemo(
    () =>
      `/home/${tableSchema.schema}/resource/${tableSchema.name}/${primaryKeys.map((key) => row.original?.[key.name as keyof ResourceDataSchema]?.toString() ?? "").join("/")}`,
    [tableSchema.schema, tableSchema.name, primaryKeys, row.original],
  );

  const editHref = useMemo(
    () =>
      `/home/${tableSchema.schema}/resource/${tableSchema.name}/edit/${primaryKeys.map((key) => row.original?.[key.name as keyof ResourceDataSchema]?.toString() ?? "").join("/")}`,
    [tableSchema.schema, tableSchema.name, primaryKeys, row.original],
  );

  // Memoize onSelect handler to avoid creating new function on every render
  const handleDelete = useCallback(() => {
    setRowAction({ row, variant: "delete" });
  }, [setRowAction, row]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" className="size-5">
          <EllipsisIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {permissions.canSelect && (
          <Link href={viewHref}>
            <DropdownMenuItem>
              <ViewIcon className="size-4" />
              View Detail
            </DropdownMenuItem>
          </Link>
        )}
        {permissions.canUpdate && (
          <Link href={editHref}>
            <DropdownMenuItem>
              <EditIcon className="size-4" />
              Edit
            </DropdownMenuItem>
          </Link>
        )}
        {permissions.canDelete && (
          <>
            {(permissions.canSelect || permissions.canUpdate) && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
              <TrashIcon className="size-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

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
import { PrimaryKey, ResourceDataSchema, TableSchema } from "@/lib/database-meta.types";

export function ResourceTableRowActions({
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
  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  const viewHref = `/home/resource/${tableSchema.schema}/${tableSchema.name}/${primaryKeys.map((key) => row.original?.[key.name as keyof ResourceDataSchema]?.toString() ?? "").join("/")}`;
  const editHref = `/home/resource/${tableSchema.schema}/${tableSchema.name}/edit/${primaryKeys.map((key) => row.original?.[key.name as keyof ResourceDataSchema]?.toString() ?? "").join("/")}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" className="size-5">
          <EllipsisIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <Link href={viewHref}>
          <DropdownMenuItem>
            <ViewIcon className="size-4" />
            View Detail
          </DropdownMenuItem>
        </Link>
        <Link href={editHref}>
          <DropdownMenuItem>
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => setRowAction({ row, variant: "delete" })}
        >
          <TrashIcon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

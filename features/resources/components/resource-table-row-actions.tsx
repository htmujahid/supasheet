import { EllipsisIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import { ResourceDataSchema } from "@/lib/database-meta.types";
import Link from "next/link";

export function ResourceTableRowActions({
  row,
  href,
  setRowAction,
}: {
  row: Row<ResourceDataSchema>;
  href: string;
  setRowAction: (rowAction: DataTableRowAction<ResourceDataSchema> | null) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="size-5"
        >
          <EllipsisIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <Link href={href}>
          <DropdownMenuItem>
            Views
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, variant: "update" })}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, variant: "delete" })}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
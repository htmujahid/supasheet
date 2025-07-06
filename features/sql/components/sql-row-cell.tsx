import { Row } from "@tanstack/react-table";
import { CopyIcon } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableSchema } from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

export function SqlRowCell({
  row,
  title,
}: {
  row: Row<TableSchema>;
  title: string;
}) {
  const value = row.original?.[title as keyof TableSchema];

  // if typeof cell is array or json
  if (Array.isArray(value) || typeof value === "object") {
    return <pre className="truncate">{JSON.stringify(value, null, 0)}</pre>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cn("relative truncate select-none")}>
          {value?.toString() || ""}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(value?.toString() ?? "");
          }}
        >
          <CopyIcon className="size-4" />
          Copy Cell Content
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

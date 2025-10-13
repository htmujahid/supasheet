import { memo, useCallback } from "react";
import { CopyIcon } from "lucide-react";

import { Row } from "@tanstack/react-table";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ColumnSchema,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

export const ReportRowCell = memo(function ReportRowCell({
  row,
  columnSchema,
}: {
  row: Row<ResourceDataSchema>;
  columnSchema: ColumnSchema;
}) {
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

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={"relative truncate select-none"}
        >
          {value?.toString()}
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
      </ContextMenuContent>
    </ContextMenu>
  );
});

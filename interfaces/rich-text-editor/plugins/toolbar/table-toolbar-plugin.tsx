"use client";

import { TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToolbarContext } from "@/interfaces/rich-text-editor/context/toolbar-context";
import { InsertTableDialog } from "@/interfaces/rich-text-editor/plugins/table-plugin";

export function TableToolbarPlugin() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <Button
      onClick={() =>
        showModal("Insert Table", (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      size={"icon-sm"}
      variant={"outline"}
      type="button"
      className=""
    >
      <TableIcon className="size-4" />
    </Button>
  );
}

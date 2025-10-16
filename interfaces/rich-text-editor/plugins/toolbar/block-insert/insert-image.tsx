"use client";

import { ImageIcon } from "lucide-react";

import { SelectItem } from "@/components/ui/select";
import { useToolbarContext } from "@/interfaces/rich-text-editor/context/toolbar-context";
import { InsertImageDialog } from "@/interfaces/rich-text-editor/plugins/images-plugin";

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="image"
      onPointerUp={(e) => {
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </SelectItem>
  );
}

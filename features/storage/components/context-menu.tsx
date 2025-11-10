"use client";

import { Download, Edit3, Trash2 } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type StorageContextMenuProps = {
  children: React.ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onDownload?: () => void;
  isFolder: boolean;
};

export function StorageContextMenu({
  children,
  onRename,
  onDelete,
  onDownload,
  isFolder,
}: StorageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onRename}>
          <Edit3 className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        {!isFolder && onDownload && (
          <ContextMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

"use client";

import {
  Copy,
  Download,
  Edit3,
  Info,
  MoreHorizontal,
  Move,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { StorageFile } from "../types";

interface FileActionsMenuProps {
  file: StorageFile;
  onMove: (file: StorageFile) => void;
  onCopy: (file: StorageFile) => void;
  onRename: (file: StorageFile) => void;
  onViewDetails: (file: StorageFile) => void;
  onDelete: (file: StorageFile) => void;
  onDownload?: (file: StorageFile) => void;
}

export function FileActionsMenu({
  file,
  onMove,
  onCopy,
  onRename,
  onViewDetails,
  onDelete,
  onDownload,
}: FileActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {!file.isFolder && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(file);
              }}
            >
              <Info className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {onDownload && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onRename(file);
          }}
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onCopy(file);
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onMove(file);
          }}
        >
          <Move className="mr-2 h-4 w-4" />
          Move
        </DropdownMenuItem>
        {!file.isFolder && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

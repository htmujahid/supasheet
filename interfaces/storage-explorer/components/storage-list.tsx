"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Archive,
  File,
  FileText,
  Folder,
  Image,
  Music,
  Video,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";
import { cn } from "@/lib/utils";

import type { StorageFile } from "../types";
import { CopyFileDialog } from "./copy-file-dialog";
import { FileActionsMenu } from "./file-actions-menu";
import { FileDetailsDrawer } from "./file-details-drawer";
import { MoveFileDialog } from "./move-file-dialog";
import { RenameDialog } from "./rename-dialog";

interface StorageListProps {
  files: StorageFile[];
  selectedFiles: Set<string>;
  onFileSelect: (fileId: string) => void;
  onFileOpen?: (file: StorageFile) => void;
  bucketId: string;
  currentPath: string;
  isLoading: boolean;
}

export function StorageList({
  files,
  selectedFiles,
  onFileSelect,
  onFileOpen,
  bucketId,
  currentPath,
  isLoading,
}: StorageListProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<StorageFile | null>(null);
  const [fileDetailsOpen, setFileDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState<StorageFile | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [fileToCopy, setFileToCopy] = useState<StorageFile | null>(null);
  const getFileIcon = (file: StorageFile) => {
    if (file.isFolder) return <Folder className="text-primary h-4 w-4" />;

    const type = file.type?.toLowerCase() || "";
    if (type.startsWith("image/"))
      return <Image className="text-primary/80 h-4 w-4" />;
    if (type.startsWith("video/"))
      return <Video className="text-primary/70 h-4 w-4" />;
    if (type.startsWith("audio/"))
      return <Music className="text-primary/60 h-4 w-4" />;
    if (type.includes("zip") || type.includes("tar"))
      return <Archive className="text-muted-foreground h-4 w-4" />;
    if (type.includes("text") || type.includes("document"))
      return <FileText className="text-muted-foreground/80 h-4 w-4" />;

    return <File className="text-muted-foreground/60 h-4 w-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleSingleFileDelete = async (file: StorageFile) => {
    try {
      const path = file.path || file.name;
      await supabase.storage.from(bucketId).remove([path]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Dialog handlers
  const startRename = (file: StorageFile) => {
    setFileToRename(file);
    setRenameDialogOpen(true);
  };

  const startMove = (file: StorageFile) => {
    setFileToMove(file);
    setMoveDialogOpen(true);
  };

  const startCopy = (file: StorageFile) => {
    setFileToCopy(file);
    setCopyDialogOpen(true);
  };

  const openFileDetails = (file: StorageFile) => {
    setSelectedFile(file);
    setFileDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 flex-col items-center justify-center">
        <Folder className="text-muted-foreground/50 mb-4 h-16 w-16" />
        <p>This folder is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {files.map((file) => {
        const isSelected = selectedFiles.has(file.path || file.name);
        return (
          <div
            key={file.id}
            className={cn(
              "group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors",
              isSelected ? "bg-accent" : "hover:bg-accent/50",
            )}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("[data-checkbox]")) return;
              if (file.isFolder) {
                onFileOpen?.(file);
              } else {
                openFileDetails(file);
              }
            }}
          >
            <div data-checkbox>
              <Checkbox
                checked={file.isFolder ? false : isSelected}
                onCheckedChange={
                  file.isFolder
                    ? undefined
                    : () => onFileSelect(file.path || file.name)
                }
                disabled={file.isFolder}
                className="h-4 w-4"
              />
            </div>

            {getFileIcon(file)}

            <span
              className="flex-1 cursor-pointer truncate text-sm hover:underline"
              title={file.name}
              onDoubleClick={(e) => {
                e.stopPropagation();
                startRename(file);
              }}
            >
              {file.name}
            </span>

            {!file.isFolder && file.size && (
              <span className="text-muted-foreground text-xs">
                {formatFileSize(file.size)}
              </span>
            )}

            <span className="text-muted-foreground text-xs">
              {formatDate(file.lastModified)}
            </span>

            <FileActionsMenu
              file={file}
              onMove={startMove}
              onCopy={startCopy}
              onRename={startRename}
              onViewDetails={openFileDetails}
              onDelete={handleSingleFileDelete}
            />
          </div>
        );
      })}

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        file={fileToRename}
        bucketId={bucketId}
        onClose={() => setFileToRename(null)}
      />

      <FileDetailsDrawer
        open={fileDetailsOpen}
        onOpenChange={setFileDetailsOpen}
        file={selectedFile}
        bucketId={bucketId}
      />

      <MoveFileDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        file={fileToMove}
        currentPath={currentPath}
        bucketId={bucketId}
        onClose={() => setFileToMove(null)}
      />

      <CopyFileDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        file={fileToCopy}
        currentPath={currentPath}
        bucketId={bucketId}
        onClose={() => setFileToCopy(null)}
      />
    </div>
  );
}

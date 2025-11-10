"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";

import type { StorageFile } from "../lib/types";

type MoveFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: StorageFile | null;
  currentPath: string;
  bucketId: string;
  onClose?: () => void;
};

export function MoveFileDialog({
  open,
  onOpenChange,
  file,
  currentPath,
  bucketId,
  onClose,
}: MoveFileDialogProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [newPath, setNewPath] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (file && open) {
      // Initialize with current path or empty for root
      setNewPath(currentPath || "");
    }
  }, [file, currentPath, open]);

  const handleMove = async () => {
    if (!file || newPath === currentPath) return;

    startTransition(async () => {
      const oldPath = file.path || file.name;
      const fileName = oldPath.split("/").pop() || file.name;
      const fullNewPath = newPath.trim()
        ? `${newPath.trim()}/${fileName}`
        : fileName;

      const { error } = await supabase.storage
        .from(bucketId)
        .move(oldPath, fullNewPath);

      if (error) {
        console.error("Error moving file:", error);
        toast.error(
          `Failed to move ${file.isFolder ? "folder" : "file"}: ${error.message}`,
        );
      } else {
        router.refresh();
        handleClose();
        toast.success(
          `Successfully moved ${file.isFolder ? "folder" : "file"} "${file.name}" to ${newPath.trim() || "root"}`,
        );
      }
    });
  };

  const handleClose = () => {
    setNewPath("");
    onOpenChange(false);
    if (onClose) onClose();
  };

  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move {file.isFolder ? "Folder" : "File"}</DialogTitle>
          <DialogDescription>
            Move &quot;{file.name}&quot; to a new location. Enter the
            destination path.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-path" className="text-right">
              Path
            </Label>
            <Input
              id="new-path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="folder/subfolder (empty for root)"
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMove();
                }
              }}
            />
          </div>
          <div className="text-muted-foreground col-span-4 text-xs">
            Current location: {currentPath || "(root)"}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={isPending}>
            {isPending ? "Moving..." : "Move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

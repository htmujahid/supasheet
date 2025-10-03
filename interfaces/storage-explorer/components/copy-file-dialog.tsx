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

import type { StorageFile } from "../types";

interface CopyFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: StorageFile | null;
  currentPath: string;
  bucketId: string;
  onClose?: () => void;
}

export function CopyFileDialog({
  open,
  onOpenChange,
  file,
  currentPath,
  bucketId,
  onClose,
}: CopyFileDialogProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [newPath, setNewPath] = useState("");
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (file && open) {
      setNewPath(currentPath || "");
      // Add "Copy of " prefix to the name
      setNewName(`Copy of ${file.name}`);
    }
  }, [file, currentPath, open]);

  const handleCopy = async () => {
    if (!file || !newName.trim()) return;

    startTransition(async () => {
      const oldPath = file.path || file.name;
      const fullNewPath = newPath.trim()
        ? `${newPath.trim()}/${newName.trim()}`
        : newName.trim();

      const { error } = await supabase.storage
        .from(bucketId)
        .copy(oldPath, fullNewPath);

      if (error) {
        console.error("Error copying file:", error);
        toast.error(
          `Failed to copy ${file.isFolder ? "folder" : "file"}: ${error.message}`,
        );
      } else {
        router.refresh();
        handleClose();
        toast.success(
          `Successfully copied ${file.isFolder ? "folder" : "file"} "${file.name}"`,
        );
      }
    });
  };

  const handleClose = () => {
    setNewPath("");
    setNewName("");
    onOpenChange(false);
    if (onClose) onClose();
  };

  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy {file.isFolder ? "Folder" : "File"}</DialogTitle>
          <DialogDescription>
            Create a copy of "{file.name}" with a new name and location.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="copy-path" className="text-right">
              Path
            </Label>
            <Input
              id="copy-path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="folder/subfolder (empty for root)"
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copy-name" className="text-right">
              Name
            </Label>
            <Input
              id="copy-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCopy();
                }
              }}
            />
          </div>
          <div className="text-muted-foreground col-span-4 text-xs">
            Original location: {currentPath || "(root)"}/{file.name}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCopy} disabled={!newName.trim() || isPending}>
            {isPending ? "Copying..." : "Copy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

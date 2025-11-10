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

type RenameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: StorageFile | null;
  bucketId: string;
  onClose?: () => void;
};

export function RenameDialog({
  open,
  onOpenChange,
  file,
  bucketId,
  onClose,
}: RenameDialogProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (file && open) {
      setNewName(file.name);
    }
  }, [file, open]);

  const handleRename = async () => {
    if (!file || !newName.trim() || newName === file.name) return;

    startTransition(async () => {
      const oldPath = file.path || file.name;
      const newPath = oldPath
        .split("/")
        .slice(0, -1)
        .concat(newName.trim())
        .join("/");

      const { error } = await supabase.storage
        .from(bucketId)
        .move(oldPath, newPath);

      if (error) {
        console.error("Error renaming:", error);
        toast.error(
          `Failed to rename ${file.isFolder ? "folder" : "file"}: ${error.message}`,
        );
      } else {
        router.refresh();
        handleClose();
        toast.success(
          `Successfully renamed ${file.isFolder ? "folder" : "file"} to "${newName.trim()}"`,
        );
      }
    });
  };

  const handleClose = () => {
    setNewName("");
    onOpenChange(false);
    if (onClose) onClose();
  };

  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename {file.isFolder ? "Folder" : "File"}</DialogTitle>
          <DialogDescription>
            Enter a new name for this {file.isFolder ? "folder" : "file"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-name" className="text-right">
              Name
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={!newName.trim() || newName === file.name || isPending}
          >
            {isPending ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

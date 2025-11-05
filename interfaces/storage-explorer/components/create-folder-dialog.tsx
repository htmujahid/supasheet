"use client";

import { useState, useTransition } from "react";

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

type CreateFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucketId: string;
  currentPath: string;
};

export function CreateFolderDialog({
  open,
  onOpenChange,
  bucketId,
  currentPath,
}: CreateFolderDialogProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [folderName, setFolderName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleNewFolder() {
    if (!folderName.trim()) return;

    startTransition(async () => {
      const folderPath = currentPath
        ? `${currentPath}/${folderName.trim()}/.keep`
        : `${folderName.trim()}/.keep`;
      const { error } = await supabase.storage
        .from(bucketId)
        .upload(folderPath, new Blob([""], { type: "text/plain" }), {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error creating folder:", error);
        toast.error(`Failed to create folder: ${error.message}`);
      } else {
        router.refresh();
        handleClose();
        toast.success(`Successfully created folder "${folderName.trim()}"`);
      }
    });
  }

  const handleClose = () => {
    setFolderName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Enter a name for the new folder</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folder-name" className="text-right">
              Name
            </Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="col-span-3"
              placeholder="New folder"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewFolder();
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
            onClick={handleNewFolder}
            disabled={!folderName.trim() || isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

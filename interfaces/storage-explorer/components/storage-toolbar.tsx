"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { FolderPlus, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";

import { CreateFolderDialog } from "./create-folder-dialog";
import { UploadDialog } from "./upload-dialog";

interface StorageToolbarProps {
  selectedFiles: Set<string>;
  bucketId: string;
  currentPath: string;
  onSearchChange: (query: string) => void;
  onSelectionChange: (selectedFiles: Set<string>) => void;
}

export function StorageToolbar({
  selectedFiles,
  bucketId,
  currentPath,
  onSearchChange,
  onSelectionChange,
}: StorageToolbarProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    const { data, error } = await supabase.storage.from(bucketId).remove(Array.from(selectedFiles));
    if (!data?.length) {
      toast.error("You don't have permission to delete these files");
    } else if (error) {
      toast.error(error ?? "Failed to delete files");
    } else {
      toast.success("Files deleted successfully");
    }
    onSelectionChange(new Set()); // Clear selection after deletion
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCreateFolderDialogOpen(true)}
          className="gap-2"
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={selectedFiles.size === 0}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete ({selectedFiles.size})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.refresh()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearchChange(e.target.value);
          }}
          className="w-full pl-8"
        />
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        bucketId={bucketId}
        currentPath={currentPath}
      />

      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        bucketId={bucketId}
        currentPath={currentPath}
      />
    </div>
  );
}

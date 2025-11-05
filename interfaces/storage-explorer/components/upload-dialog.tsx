"use client";

import { useRef, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Upload } from "lucide-react";
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
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";
import { cn } from "@/lib/utils";

type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucketId: string;
  currentPath: string;
};

export function UploadDialog({
  open,
  onOpenChange,
  bucketId,
  currentPath,
}: UploadDialogProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    startTransition(async () => {
      const uploadPromises = Array.from(selectedFiles).map((file) => {
        const filePath = currentPath
          ? `${currentPath}/${file.name}`
          : file.name;
        return supabase.storage.from(bucketId).upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((result) => !result.error).length;
      const failureCount = results.filter((result) => result.error).length;

      if (failureCount > 0) {
        const firstError = results.find((result) => result.error)?.error;
        toast.error(
          `Failed to upload ${failureCount} file(s). ${successCount} file(s) uploaded successfully. Error: ${firstError?.message || "Unknown error"}`,
        );
      } else {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
      }

      router.refresh();
      handleClose();
    });
  };

  const handleClose = () => {
    setSelectedFiles(null);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            dragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload className="text-muted-foreground mx-auto mb-4 h-10 w-10" />

          {selectedFiles && selectedFiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {selectedFiles.length} file(s) selected
              </p>
              <div className="max-h-32 overflow-auto">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="text-muted-foreground text-xs">
                    {file.name} ({formatFileSize(file.size)})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="mb-1 text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-muted-foreground text-xs">
                You can select multiple files
              </p>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFiles || isPending}>
            {isPending
              ? "Uploading..."
              : `Upload ${selectedFiles ? `(${selectedFiles.length})` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useCallback, useState } from "react";

import { CircleUserRoundIcon, XIcon } from "lucide-react";
import { type FieldPath } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  type FileMetadata,
  type FileWithPreview,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { ResourceDataSchema } from "@/lib/database-meta.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import {
  deleteFileFromStorage,
  uploadFileToStorage,
} from "./file-field-storage";
import type { FileFieldConfig, FileFieldProps, UploadProgress } from "./types";

export function AvatarField({
  form,
  columnMetadata,
  field,
  columnSchema,
}: FileFieldProps) {
  const client = useSupabase();

  // Parse configuration from column comment
  const config = JSON.parse(columnSchema.comment ?? "{}") as FileFieldConfig;
  const maxSize = config.maxSize ?? 5 * 1024 * 1024;

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );

  // Storage path pattern: {schema}/{table}/{column}
  const storagePath = `${columnSchema.schema}/${columnSchema.table}/${columnSchema.name}`;

  // Get current avatar URL from form
  const currentValue = form.watch(field.name as any) as string | null;

  // Load initial file from form value
  const loadInitialFile = useCallback((): FileMetadata[] => {
    if (!currentValue || typeof currentValue !== "string") return [];

    const fileName = currentValue.split("/").pop()?.split("?")[0] || "avatar";
    return [
      {
        name: fileName,
        size: 0,
        type: "image",
        url: currentValue,
        id: currentValue,
      } as FileMetadata,
    ];
  }, [currentValue]);

  // Handle new file being added
  const handleFileAdded = useCallback(
    (addedFiles: FileWithPreview[]) => {
      const fileWithPreview = addedFiles[0];
      if (!fileWithPreview || !(fileWithPreview.file instanceof File)) return;

      // Store file reference for type safety in async context
      const file = fileWithPreview.file;
      const fileId = fileWithPreview.id;

      // Initialize progress tracking
      setUploadProgress({
        fileId,
        progress: 0,
        completed: false,
      });

      // Upload file
      (async () => {
        try {
          const url = await uploadFileToStorage(
            client,
            file,
            storagePath,
            (progress) => {
              setUploadProgress({
                fileId,
                progress,
                completed: false,
              });
            },
          );

          // Update form value with new URL
          form.setValue(field.name as FieldPath<ResourceDataSchema>, url);

          // Mark as completed
          setUploadProgress({
            fileId,
            progress: 100,
            completed: true,
          });

          // Clear progress after a short delay
          setTimeout(() => setUploadProgress(null), 1000);
        } catch (error) {
          setUploadProgress({
            fileId,
            progress: 0,
            completed: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
        }
      })();
    },
    [client, storagePath, form, field.name],
  );

  // Handle file removal
  const handleFileRemoved = useCallback(
    async (fileUrl?: string) => {
      setUploadProgress(null);

      if (!fileUrl) {
        // Just clear the form value if no URL to delete
        form.setValue(field.name as FieldPath<ResourceDataSchema>, null);
        return;
      }

      try {
        await deleteFileFromStorage(client, fileUrl);
        form.setValue(field.name as FieldPath<ResourceDataSchema>, null);
      } catch (error) {
        console.error("Failed to delete avatar:", error);
      }
    },
    [client, form, field.name],
  );

  // Use file upload hook
  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: false,
    maxSize,
    maxFiles: 1,
    accept: "image/*",
    initialFiles: loadInitialFile(),
    onFilesAdded: handleFileAdded,
  });

  const previewUrl = files[0]?.preview || currentValue || null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          type="button"
          className="relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          disabled={columnMetadata.disabled}
          aria-label={previewUrl ? "Change avatar" : "Upload avatar"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Avatar"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}

          {/* Upload progress overlay */}
          {uploadProgress && !uploadProgress.completed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-xs text-white">
                {uploadProgress.progress}%
              </div>
            </div>
          )}
        </button>

        {/* Remove button */}
        {previewUrl && !columnMetadata.disabled && (
          <Button
            type="button"
            onClick={() => {
              const file = files[0];
              const fileUrl =
                file && !(file.file instanceof File)
                  ? (file.file as FileMetadata).url
                  : currentValue;
              handleFileRemoved(fileUrl || undefined);
              if (file) removeFile(file.id);
            }}
            size="icon"
            className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            aria-label="Remove avatar"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          disabled={columnMetadata.disabled}
          className="sr-only"
          aria-label="Upload avatar image file"
          tabIndex={-1}
        />
      </div>

      {/* Error message */}
      {uploadProgress?.error && (
        <p className="text-destructive text-xs" role="alert">
          {uploadProgress.error}
        </p>
      )}
    </div>
  );
}

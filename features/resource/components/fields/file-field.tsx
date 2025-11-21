"use client";

import { useCallback, useState } from "react";

import {
  AlertCircleIcon,
  FileUpIcon,
  XIcon
} from "lucide-react";
import { type FieldPath, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  type FileMetadata,
  type FileWithPreview,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { ResourceDataSchema } from "@/lib/database-meta.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";
import { cn } from "@/lib/utils";

import {
  deleteFileFromStorage,
  uploadFileToStorage,
} from "./file-field-storage";
import type { FileFieldConfig, FileFieldProps, FileObject, UploadProgress } from "./types";
import { formatFileSize, getFileIcon } from "../../lib/utils/files";

export function FileField({
  form,
  columnMetadata,
  field,
  control,
  columnSchema,
}: FileFieldProps) {
  const client = useSupabase();

  // Parse configuration from column comment
  const config = JSON.parse(columnSchema.comment ?? "{}") as FileFieldConfig;
  const maxSize = config.maxSize ?? 5 * 1024 * 1024;
  const maxFiles = config.maxFiles ?? 1;
  const accept = config.accept ?? "*";

  // Form field array for managing file URLs
  const fieldArray = useFieldArray({
    control,
    name: field.name as never,
  });

  // Upload progress tracking
  const [_, setUploadProgress] = useState<UploadProgress[]>([]);

  // Storage path pattern: {schema}/{table}/{column}
  const storagePath = `${columnSchema.schema}/${columnSchema.table}/${columnSchema.name}`;

  // Load existing files from field array
  const loadInitialFiles = useCallback((): FileMetadata[] => {
    if (!fieldArray.fields?.length) return [];

    return fieldArray.fields
      .map((_item, index) => {
        const file = form.getValues(`${field.name}.${index}` as any) as FileObject;
        if (!file || typeof file !== "object") return null;

        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          id: file.url,
        }
      })
      .filter((item): item is FileMetadata => item !== null);
  }, [fieldArray.fields, form, field.name]);

  // Handle new files being added
  const handleFilesAdded = useCallback(
    (addedFiles: FileWithPreview[]) => {
      // Initialize progress tracking
      const newProgressItems = addedFiles.map((file) => ({
        fileId: file.id,
        progress: 0,
        completed: false,
      }));
      setUploadProgress((prev) => [...prev, ...newProgressItems]);

      // Upload each file
      addedFiles.forEach(async (fileWithPreview) => {
        if (!(fileWithPreview.file instanceof File)) return;

        try {
          const url = await uploadFileToStorage(
            client,
            fileWithPreview.file,
            storagePath,
            (progress) => {
              setUploadProgress((prev) =>
                prev.map((item) =>
                  item.fileId === fileWithPreview.id
                    ? { ...item, progress }
                    : item,
                ),
              );
            },
          );

          // Add URL to field array
          // fieldArray.append(url as any);
          fieldArray.append({
            name: fileWithPreview.file.name,
            type: fileWithPreview.file.type,
            size: fileWithPreview.file.size,
            url,
            last_modified: new Date(fileWithPreview.file.lastModified).toISOString(),
          });

          // Mark as completed
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === fileWithPreview.id
                ? { ...item, completed: true }
                : item,
            ),
          );
        } catch (error) {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === fileWithPreview.id
                ? {
                  ...item,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
                : item,
            ),
          );
        }
      });
    },
    [client, storagePath, fieldArray],
  );

  // Handle file removal
  const handleFileRemoved = useCallback(
    async (fileId: string, fileUrl?: string) => {
      setUploadProgress((prev) =>
        prev.filter((item) => item.fileId !== fileId),
      );

      if (!fileUrl) return;

      try {
        await deleteFileFromStorage(client, fileUrl);

        // Find and remove from field array
        const index = fieldArray.fields.findIndex((_item, idx) => {
          const url = form.getValues(`${field.name}.${idx}` as any);
          return url === fileUrl;
        });

        if (index !== -1) {
          fieldArray.remove(index);

          // Set to null if array becomes empty
          if (fieldArray.fields.length === 1) {
            form.setValue(field.name as FieldPath<ResourceDataSchema>, null);
          }
        }
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    },
    [client, fieldArray, form, field.name],
  );

  // Handle remove all files
  const handleRemoveAll = useCallback(async () => {
    // Delete all files from storage
    await Promise.all(
      files.map((file) => {
        if (!(file.file instanceof File)) {
          const fileUrl = (file.file as FileMetadata).url;
          return deleteFileFromStorage(client, fileUrl).catch(console.error);
        }
        return Promise.resolve();
      }),
    );

    // Clear state and field array
    setUploadProgress([]);
    fieldArray.remove();
    form.setValue(field.name as FieldPath<ResourceDataSchema>, null);
    clearFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, fieldArray, form, field.name]);

  // Use file upload hook
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: maxFiles > 1,
    maxSize,
    maxFiles,
    accept,
    initialFiles: loadInitialFiles(),
    onFilesAdded: handleFilesAdded,
  });

  return (
    <div className="flex flex-col gap-2 p-3 border border-border rounded-md">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input p-6 outline-none transition-colors hover:bg-accent/30 focus-visible:border-ring/50",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            aria-hidden="true"
          >
            <FileUpIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="mb-2 text-xs text-muted-foreground">
            Drag & drop or click to browse
          </p>
          <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground/70">
            <span>All files</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatFileSize(maxSize)}</span>
          </div>
        </div>
      </div>
      <input
        {...getInputProps()}
        disabled={columnMetadata.disabled}
        className="sr-only"
        aria-label="Upload files"
      />

      {/* Error messages */}
      {errors.length > 0 && (
        <div
          className="rounded-md bg-destructive/10 px-3 py-2 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-muted-foreground text-xs">
              {files.length} {files.length === 1 ? "file" : "files"}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-muted-foreground text-xs"
              onClick={handleRemoveAll}
            >
              Clear all
            </Button>
          </div>
          <div className="max-h-[200px] space-y-1 overflow-y-auto">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.file.type);

              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/50 px-2 py-1.5"
                >
                  {FileIcon && (
                    <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm">{file.file.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-5 rounded-sm"
                    onClick={() => { removeFile(file.id); handleFileRemoved(file.id, typeof file.file === 'object' ? undefined : (file.file as FileMetadata).url); }}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client"

import { useCallback, useState } from "react"
import { AlertCircleIcon, Trash2Icon, UploadIcon } from "lucide-react"
import {
  type FieldPath,
  useFieldArray,
} from "react-hook-form"

import { useFileUpload, type FileWithPreview, type FileMetadata } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { ResourceDataSchema } from "@/lib/database-meta.types"
import { useSupabase } from "@/lib/supabase/hooks/use-supabase"
import { uploadFileToStorage, deleteFileFromStorage } from "./file-field-storage"
import { FileFieldItem } from "./file-field-item"
import { FileFieldEmptyState } from "./file-field-empty-state"
import type { FileFieldProps, UploadProgress, FileFieldConfig } from "./types"

export function FileField({ form, columnMetadata, field, control, columnSchema }: FileFieldProps) {
  const client = useSupabase()

  // Parse configuration from column comment
  const config = JSON.parse(columnSchema.comment ?? "{}") as FileFieldConfig
  const maxSize = config.maxSize ?? 5 * 1024 * 1024
  const maxFiles = config.maxFiles ?? 1
  const accept = config.accept ?? "*"
  const maxSizeMB = Math.floor(maxSize / (1024 * 1024))

  // Form field array for managing file URLs
  const fieldArray = useFieldArray({
    control,
    name: field.name as never,
  })

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])

  // Storage path pattern: {schema}/{table}/{column}
  const storagePath = `${columnSchema.schema}/${columnSchema.table}/${columnSchema.name}`

  // Load existing files from field array
  const loadInitialFiles = useCallback((): FileMetadata[] => {
    if (!fieldArray.fields?.length) return []

    return fieldArray.fields
      .map((_item, index) => {
        const url = form.getValues(`${field.name}.${index}` as any) as string
        if (!url || typeof url !== "string") return null

        const fileName = url.split("/").pop()?.split("?")[0] || "file"
        return {
          name: fileName,
          size: 0,
          type: "",
          url,
          id: url,
        } as FileMetadata
      })
      .filter((item): item is FileMetadata => item !== null)
  }, [fieldArray.fields, form, field.name])

  // Handle new files being added
  const handleFilesAdded = useCallback(
    (addedFiles: FileWithPreview[]) => {
      // Initialize progress tracking
      const newProgressItems = addedFiles.map((file) => ({
        fileId: file.id,
        progress: 0,
        completed: false,
      }))
      setUploadProgress((prev) => [...prev, ...newProgressItems])

      // Upload each file
      addedFiles.forEach(async (fileWithPreview) => {
        if (!(fileWithPreview.file instanceof File)) return

        try {
          const url = await uploadFileToStorage(
            client,
            fileWithPreview.file,
            storagePath,
            (progress) => {
              setUploadProgress((prev) =>
                prev.map((item) =>
                  item.fileId === fileWithPreview.id ? { ...item, progress } : item
                )
              )
            }
          )

          // Add URL to field array
          fieldArray.append(url as any)

          // Mark as completed
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === fileWithPreview.id ? { ...item, completed: true } : item
            )
          )
        } catch (error) {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === fileWithPreview.id
                ? { ...item, error: error instanceof Error ? error.message : "Upload failed" }
                : item
            )
          )
        }
      })
    },
    [client, storagePath, fieldArray]
  )

  // Handle file removal
  const handleFileRemoved = useCallback(
    async (fileId: string, fileUrl?: string) => {
      setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId))

      if (!fileUrl) return

      try {
        await deleteFileFromStorage(client, fileUrl)

        // Find and remove from field array
        const index = fieldArray.fields.findIndex((_item, idx) => {
          const url = form.getValues(`${field.name}.${idx}` as any)
          return url === fileUrl
        })

        if (index !== -1) {
          fieldArray.remove(index)

          // Set to null if array becomes empty
          if (fieldArray.fields.length === 1) {
            form.setValue(field.name as FieldPath<ResourceDataSchema>, null)
          }
        }
      } catch (error) {
        console.error("Failed to delete file:", error)
      }
    },
    [client, fieldArray, form, field.name]
  )

  // Handle remove all files
  const handleRemoveAll = useCallback(async () => {
    // Delete all files from storage
    await Promise.all(
      files.map((file) => {
        if (!(file.file instanceof File)) {
          const fileUrl = (file.file as FileMetadata).url
          return deleteFileFromStorage(client, fileUrl).catch(console.error)
        }
        return Promise.resolve()
      })
    )

    // Clear state and field array
    setUploadProgress([])
    fieldArray.remove()
    form.setValue(field.name as FieldPath<ResourceDataSchema>, null)
    clearFiles()
  }, [client, fieldArray, form, field.name])

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
  })

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          disabled={columnMetadata.disabled}
          className="sr-only"
          aria-label="Upload files"
        />

        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            {/* Header with file count and actions */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">Files ({files.length})</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}
                >
                  <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Add files
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={files.length === 0}
                  onClick={handleRemoveAll}
                >
                  <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Remove all
                </Button>
              </div>
            </div>

            {/* File list */}
            <div className="w-full space-y-2">
              {files.map((file) => {
                const fileProgress = uploadProgress.find((p) => p.fileId === file.id)

                return (
                  <FileFieldItem
                    key={file.id}
                    file={file}
                    progress={fileProgress}
                    onRemove={(fileId, fileUrl) => {
                      handleFileRemoved(fileId, fileUrl)
                      removeFile(fileId)
                    }}
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <FileFieldEmptyState
            maxFiles={maxFiles}
            maxSizeMB={maxSizeMB}
            onSelectFiles={openFileDialog}
          />
        )}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}

import { AlertCircleIcon, XIcon } from "lucide-react"
import { formatBytes, type FileMetadata, type FileWithPreview } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import type { UploadProgress } from "./types"
import { FileFieldIcon } from "./file-field-icon"

type FileFieldItemProps = {
  file: FileWithPreview
  progress?: UploadProgress
  onRemove: (fileId: string, fileUrl?: string) => void
}

export function FileFieldItem({ file, progress, onRemove }: FileFieldItemProps) {
  const isUploading = progress && !progress.completed

  return (
    <div
      data-uploading={isUploading || undefined}
      className="bg-background flex flex-col gap-1 rounded-lg border p-2 pe-3 transition-opacity duration-300"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50">
          <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
            <FileFieldIcon file={file} />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-[13px] font-medium">
              {file.file instanceof File ? file.file.name : file.file.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.file instanceof File ? file.file.size : file.file.size)}
            </p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
          onClick={() => {
            const fileUrl = file.file instanceof File ? undefined : (file.file as FileMetadata).url
            onRemove(file.id, fileUrl)
          }}
          aria-label="Remove file"
        >
          <XIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Upload progress or error */}
      {progress && !progress.completed && (
        <>
          {progress.error ? (
            <div className="text-destructive mt-1 flex items-center gap-1 text-xs">
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{progress.error}</span>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <span className="text-muted-foreground w-10 text-xs tabular-nums">
                {progress.progress}%
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

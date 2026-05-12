import { useState } from "react"

import { ImageOffIcon } from "lucide-react"

import { formatFileSize, getFileIcon } from "#/lib/files"
import { cn } from "#/lib/utils"
import type { FileObject } from "#/types/fields"

import { ResourceFilePreviewDialog } from "./resource-file-preview-dialog"

export function ResourceFileDisplay({ value }: { value: FileObject[] | null }) {
  const [previewFile, setPreviewFile] = useState<FileObject | null>(null)

  if (!value?.length) return null

  return (
    <>
      <div className="flex flex-col gap-2">
        {value.map((file, index) => (
          <FileCard
            key={`${file.url}-${index}`}
            file={file}
            onOpen={() => setPreviewFile(file)}
          />
        ))}
      </div>
      <ResourceFilePreviewDialog
        open={Boolean(previewFile)}
        onOpenChange={(open) => {
          if (!open) setPreviewFile(null)
        }}
        file={previewFile}
      />
    </>
  )
}

function FileCard({ file, onOpen }: { file: FileObject; onOpen: () => void }) {
  const type = file.type ?? ""
  const isImage = type.startsWith("image/")
  const Icon = getFileIcon(type)
  const [imageBroken, setImageBroken] = useState(false)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group/file-card flex items-center gap-3 overflow-hidden rounded-md border bg-card p-2 text-left transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40">
        {isImage && !imageBroken ? (
          <img
            src={file.url}
            alt={file.name}
            className="size-full object-cover"
            onError={() => setImageBroken(true)}
          />
        ) : isImage && imageBroken ? (
          <ImageOffIcon className="size-5 text-muted-foreground" />
        ) : (
          <Icon className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {file.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {[formatFileSize(file.size ?? 0), type || "Unknown"]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
    </button>
  )
}

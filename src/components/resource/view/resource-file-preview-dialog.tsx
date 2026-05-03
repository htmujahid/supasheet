import { ExternalLinkIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import { formatFileSize, getFileIcon } from "#/lib/files"
import type { FileObject } from "#/types/fields"

export function ResourceFilePreviewDialog({
  open,
  onOpenChange,
  file,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: FileObject | null
}) {
  if (!file) return null

  const type = file.type ?? ""
  const isImage = type.startsWith("image/")
  const isVideo = type.startsWith("video/")
  const isPdf = type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf")
  const Icon = getFileIcon(type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">{file.name}</DialogTitle>
          <DialogDescription className="truncate">
            {[type || "Unknown type", formatFileSize(file.size ?? 0)]
              .filter(Boolean)
              .join(" · ")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] min-h-48 items-center justify-center overflow-hidden rounded-md bg-muted/30">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-[60vh] max-w-full object-contain"
            />
          ) : isVideo ? (
            <video
              src={file.url}
              controls
              className="max-h-[60vh] max-w-full"
            />
          ) : isPdf ? (
            <iframe
              src={file.url}
              title={file.name}
              className="h-[60vh] w-full"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <Icon className="size-12 text-muted-foreground opacity-60" />
              <span className="text-xs text-muted-foreground">
                No preview available
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ExternalLinkIcon className="mr-1.5 size-3.5" />
            Open in new tab
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

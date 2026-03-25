import { getFileIcon } from "#/lib/files"
import type { FileObject } from "#/types/fields"

export function FileCell({ value }: { value: FileObject[] }) {
  const filesCount = value?.length

  if (!filesCount) {
    return null
  }

  return (
    <div className="flex flex-nowrap items-center gap-2">
      {value?.map((file, index) => {
        const Icon = getFileIcon(file.type)
        return (
          <div
            key={index}
            className="flex flex-nowrap items-center gap-1 text-sm text-muted-foreground"
          >
            <Icon className="size-4" />
            <span>{file.name}</span>
          </div>
        )
      })}
    </div>
  )
}

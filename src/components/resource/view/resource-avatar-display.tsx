import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Label } from "#/components/ui/label"
import type { ColumnSchema } from "#/lib/database-meta.types"
import { formatFileSize } from "#/lib/files"
import { formatTitle } from "#/lib/format"
import type { ColumnMetadata, FileObject } from "#/types/fields"

export function ResourceAvatarDisplay({
  column,
  columnMetadata,
  value,
}: {
  column: ColumnSchema
  columnMetadata: ColumnMetadata
  value: FileObject | null
}) {
  const label = formatTitle((column.name as string) ?? "")
  const sizeText = value?.size ? formatFileSize(value.size) : null

  return (
    <div className="flex items-center gap-4 py-2">
      <Avatar className="size-20">
        <AvatarImage alt={label} src={value?.url} />
        <AvatarFallback>
          <UserIcon className="size-8" />
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Label className="inline-flex items-center gap-1.5 text-sm font-medium">
          {columnMetadata.icon} {label}
        </Label>
        {value ? (
          <>
            <span className="truncate text-sm text-muted-foreground">
              {value.name}
            </span>
            {sizeText && (
              <span className="text-xs text-muted-foreground/80">
                {sizeText}
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Not set</span>
        )}
      </div>
    </div>
  )
}

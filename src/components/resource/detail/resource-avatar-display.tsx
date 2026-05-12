import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { formatFileSize } from "#/lib/files"
import type { FileObject } from "#/types/fields"

export function ResourceAvatarDisplay({ value }: { value: FileObject | null }) {
  const sizeText = value?.size ? formatFileSize(value.size) : null

  return (
    <div className="flex items-center gap-4 py-2">
      <Avatar className="size-20">
        <AvatarImage alt="" src={value?.url} />
        <AvatarFallback>
          <UserIcon className="size-8" />
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
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

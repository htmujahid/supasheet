import { Suspense } from "react"

import { Sheet, SheetContent } from "#/components/ui/sheet"
import { useIsMobile } from "#/hooks/use-mobile"
import { cn } from "#/lib/utils"

import { ResourceFormSheetCreateBody } from "./resource-form-sheet-create-body"
import { ResourceFormSheetHeader } from "./resource-form-sheet-header"
import { ResourceFormSheetSkeleton } from "./resource-form-sheet-skeleton"

type Props = {
  schema: string
  resource: string
  defaults?: Record<string, string>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceFormSheet({
  schema,
  resource,
  defaults,
  open,
  onOpenChange,
}: Props) {
  const onClose = () => onOpenChange(false)
  const isMobile = useIsMobile()
  const side = isMobile ? "bottom" : "right"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "gap-0",
          side === "right" && "w-full! sm:max-w-lg!",
          side === "bottom" && "max-h-[80vh] overflow-hidden"
        )}
      >
        <ResourceFormSheetHeader
          schema={schema}
          resource={resource}
          defaults={defaults}
          onClose={onClose}
        />
        <Suspense fallback={<ResourceFormSheetSkeleton />}>
          <ResourceFormSheetCreateBody
            schema={schema}
            resource={resource}
            defaults={defaults}
            onClose={onClose}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

import { Suspense } from "react"

import { Sheet, SheetContent } from "#/components/ui/sheet"
import { useIsMobile } from "#/hooks/use-mobile"
import { cn } from "#/lib/utils"

import { ResourceFormSheetCreateBody } from "./resource-form-sheet-create-body"
import { ResourceFormSheetHeader } from "./resource-form-sheet-header"
import { ResourceFormSheetSkeleton } from "./resource-form-sheet-skeleton"
import { ResourceFormSheetUpdateBody } from "./resource-form-sheet-update-body"

type Props =
  | {
      mode: "create"
      schema: string
      resource: string
      defaults?: Record<string, string>
      open: boolean
      onOpenChange: (open: boolean) => void
    }
  | {
      mode: "update"
      schema: string
      resource: string
      pk: Record<string, unknown>
      open: boolean
      onOpenChange: (open: boolean) => void
    }

export function ResourceFormSheet(props: Props) {
  const { mode, schema, resource, open, onOpenChange } = props
  const onClose = () => onOpenChange(false)
  const isMobile = useIsMobile()
  const side = isMobile ? "bottom" : "right"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("gap-0", side === "right" && "w-full! sm:max-w-lg!", side === "bottom" && "max-h-[80vh] overflow-hidden")}
      >
        {mode === "create" ? (
          <ResourceFormSheetHeader
            mode="create"
            schema={schema}
            resource={resource}
            defaults={props.defaults}
            onClose={onClose}
          />
        ) : (
          <ResourceFormSheetHeader
            mode="update"
            schema={schema}
            resource={resource}
            pk={props.pk}
            onClose={onClose}
          />
        )}
        <Suspense fallback={<ResourceFormSheetSkeleton />}>
          {mode === "create" ? (
            <ResourceFormSheetCreateBody
              schema={schema}
              resource={resource}
              defaults={props.defaults}
              onClose={onClose}
            />
          ) : (
            <ResourceFormSheetUpdateBody
              schema={schema}
              resource={resource}
              pk={props.pk}
              onClose={onClose}
            />
          )}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

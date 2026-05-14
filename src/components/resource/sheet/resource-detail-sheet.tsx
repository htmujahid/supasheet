import { Suspense } from "react"

import { Link } from "@tanstack/react-router"

import { ExternalLinkIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import { formatTitle } from "#/lib/format"

import { ResourceDetailSheetBody } from "./resource-detail-sheet-body"
import { ResourceFormSheetSkeleton } from "./resource-form-sheet-skeleton"

type Props = {
  schema: string
  resource: string
  pk: Record<string, unknown>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceDetailSheet({
  schema,
  resource,
  pk,
  open,
  onOpenChange,
}: Props) {
  const onClose = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 sm:max-w-lg!"
      >
        <SheetHeader className="border-b">
          <div className="flex items-center gap-2 pr-6">
            <Link
              to="/$schema/resource/$resource/$resourceId/detail"
              params={
                {
                  schema,
                  resource,
                  resourceId: String(Object.values(pk)[0] ?? ""),
                } as never
              }
              onClick={onClose}
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              aria-label="Open full page"
            >
              <ExternalLinkIcon className="size-4" />
            </Link>
            <div className="space-y-1">
              <SheetTitle>View record</SheetTitle>
              <SheetDescription>{formatTitle(resource)}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Suspense fallback={<ResourceFormSheetSkeleton />}>
          <ResourceDetailSheetBody
            schema={schema}
            resource={resource}
            pk={pk}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

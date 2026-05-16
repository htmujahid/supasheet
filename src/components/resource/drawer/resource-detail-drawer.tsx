import { Suspense } from "react"

import { Link } from "@tanstack/react-router"

import { ExternalLinkIcon, XIcon } from "lucide-react"

import { Button, buttonVariants } from "#/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "#/components/ui/drawer"
import { useIsMobile } from "#/hooks/use-mobile"
import { formatTitle } from "#/lib/format"
import { cn } from "#/lib/utils"

import { ResourceDetailDrawerBody } from "./resource-detail-drawer-body"
import { ResourceFormDrawerSkeleton } from "./resource-form-drawer-skeleton"

type Props = {
  schema: string
  resource: string
  pk: Record<string, unknown>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceDetailDrawer({
  schema,
  resource,
  pk,
  open,
  onOpenChange,
}: Props) {
  const onClose = () => onOpenChange(false)
  const isMobile = useIsMobile()
  const direction = isMobile ? "bottom" : "right"

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent
        className={cn(
          "gap-0",
          direction === "right" && "h-full w-full sm:max-w-lg!"
        )}
      >
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-2 pr-10">
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
              <DrawerTitle>View record</DrawerTitle>
              <DrawerDescription>{formatTitle(resource)}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <Suspense fallback={<ResourceFormDrawerSkeleton />}>
          <ResourceDetailDrawerBody
            schema={schema}
            resource={resource}
            pk={pk}
          />
        </Suspense>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3"
            aria-label="Close"
          >
            <XIcon />
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}

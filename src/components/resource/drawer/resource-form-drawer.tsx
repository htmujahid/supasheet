import { Suspense } from "react"

import { XIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { Drawer, DrawerClose, DrawerContent } from "#/components/ui/drawer"
import { useIsMobile } from "#/hooks/use-mobile"
import { cn } from "#/lib/utils"

import { ResourceFormDrawerCreateBody } from "./resource-form-drawer-create-body"
import { ResourceFormDrawerHeader } from "./resource-form-drawer-header"
import { ResourceFormDrawerSkeleton } from "./resource-form-drawer-skeleton"
import { ResourceFormDrawerUpdateBody } from "./resource-form-drawer-update-body"

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

export function ResourceFormDrawer(props: Props) {
  const { mode, schema, resource, open, onOpenChange } = props
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
        {mode === "create" ? (
          <ResourceFormDrawerHeader
            mode="create"
            schema={schema}
            resource={resource}
            defaults={props.defaults}
            onClose={onClose}
          />
        ) : (
          <ResourceFormDrawerHeader
            mode="update"
            schema={schema}
            resource={resource}
            pk={props.pk}
            onClose={onClose}
          />
        )}
        <Suspense fallback={<ResourceFormDrawerSkeleton />}>
          {mode === "create" ? (
            <ResourceFormDrawerCreateBody
              schema={schema}
              resource={resource}
              defaults={props.defaults}
              onClose={onClose}
            />
          ) : (
            <ResourceFormDrawerUpdateBody
              schema={schema}
              resource={resource}
              pk={props.pk}
              onClose={onClose}
            />
          )}
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

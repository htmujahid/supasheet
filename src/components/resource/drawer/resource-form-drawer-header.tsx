import { Link, useLocation } from "@tanstack/react-router"

import { ExternalLinkIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "#/components/ui/drawer"
import { formatTitle } from "#/lib/format"

type Props =
  | {
      mode: "create"
      schema: string
      resource: string
      defaults?: Record<string, string>
      onClose: () => void
    }
  | {
      mode: "update"
      schema: string
      resource: string
      pk: Record<string, unknown>
      onClose: () => void
    }

export function ResourceFormDrawerHeader(props: Props) {
  const { mode, schema, resource, onClose } = props
  const location = useLocation()
  const redirectTo = location.href

  return (
    <DrawerHeader className="border-b">
      <div className="flex items-center gap-2 pr-10">
        {mode === "create" ? (
          <Link
            to="/$schema/resource/$resource/new"
            params={{ schema, resource } as never}
            search={
              {
                redirect: redirectTo,
                ...(props.defaults ? { defaults: props.defaults } : {}),
              } as never
            }
            onClick={onClose}
            className={buttonVariants({ size: "icon", variant: "ghost" })}
            aria-label="Open full page"
          >
            <ExternalLinkIcon className="size-4" />
          </Link>
        ) : (
          <Link
            to="/$schema/resource/$resource/$resourceId/update"
            params={
              {
                schema,
                resource,
                resourceId: String(Object.values(props.pk)[0] ?? ""),
              } as never
            }
            search={{ redirect: redirectTo } as never}
            onClick={onClose}
            className={buttonVariants({ size: "icon", variant: "ghost" })}
            aria-label="Open full page"
          >
            <ExternalLinkIcon className="size-4" />
          </Link>
        )}
        <div className="space-y-1">
          <DrawerTitle>
            {mode === "create" ? "New record" : "Edit record"}
          </DrawerTitle>
          <DrawerDescription>{formatTitle(resource)}</DrawerDescription>
        </div>
      </div>
    </DrawerHeader>
  )
}

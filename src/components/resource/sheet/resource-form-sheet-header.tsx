import { Link } from "@tanstack/react-router"

import { ExternalLinkIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
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

export function ResourceFormSheetHeader(props: Props) {
  const { mode, schema, resource, onClose } = props

  return (
    <SheetHeader className="border-b">
      <div className="flex items-center gap-2 pr-6">
        {mode === "create" ? (
          <Link
            to="/$schema/resource/$resource/new"
            params={{ schema, resource } as never}
            search={
              props.defaults ? ({ defaults: props.defaults } as never) : {}
            }
            onClick={onClose}
            className={buttonVariants({ size: "icon", variant: "ghost" })}
            aria-label="Open full page"
          >
            <ExternalLinkIcon className="size-4" />
          </Link>
        ) : (
          <Link
            to="/$schema/resource/$resource/update/$"
            params={
              {
                schema,
                resource,
                _splat: Object.values(props.pk)
                  .map((v) => String(v))
                  .join("/"),
              } as never
            }
            onClick={onClose}
            className={buttonVariants({ size: "icon", variant: "ghost" })}
            aria-label="Open full page"
          >
            <ExternalLinkIcon className="size-4" />
          </Link>
        )}
        <div className="space-y-1">
          <SheetTitle>
            {mode === "create" ? "New record" : "Edit record"}
          </SheetTitle>
          <SheetDescription>{formatTitle(resource)}</SheetDescription>
        </div>
      </div>
    </SheetHeader>
  )
}

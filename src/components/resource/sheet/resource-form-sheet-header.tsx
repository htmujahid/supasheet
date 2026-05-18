import { Link } from "@tanstack/react-router"

import { ExternalLinkIcon } from "lucide-react"

import { buttonVariants } from "#/components/ui/button"
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import { formatTitle } from "#/lib/format"

type Props = {
  schema: string
  resource: string
  defaults?: Record<string, string>
  onClose: () => void
}

export function ResourceFormSheetHeader(props: Props) {
  const { schema, resource, onClose } = props

  return (
    <SheetHeader className="border-b">
      <div className="flex items-center gap-2 pr-10">
        <Link
          to="/$schema/resource/$resource/new"
          params={{ schema, resource } as never}
          search={
            props.defaults ? ({ defaults: props.defaults } as never) : undefined
          }
          target="_blank"
          onClick={onClose}
          className={buttonVariants({ size: "icon", variant: "ghost" })}
          aria-label="Open full page"
        >
          <ExternalLinkIcon className="size-4" />
        </Link>
        <div className="space-y-1">
          <SheetTitle>New record</SheetTitle>
          <SheetDescription>{formatTitle(resource)}</SheetDescription>
        </div>
      </div>
    </SheetHeader>
  )
}

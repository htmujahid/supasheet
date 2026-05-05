import type { MouseEvent, ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"

import {
  useNewRecordSheet,
  useResourceFormSheet,
} from "./resource-form-sheet-provider"

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: string
  stopPropagation?: boolean
  children: ReactNode
  schema?: string
  resource?: string
  // Pre-filled field values. Applied to both inline (sheet) and full-page
  // flows. For the link path, callers can either pass `defaults` and let the
  // trigger build the URL, or pass a fully-formed `url`.
  defaults?: Record<string, string>
  // Full URL used for the link (non-inline) path. Defaults to
  // `/<schema>/resource/<resource>/new`. Caller may include query strings
  // (e.g. `?redirect=...&defaults=...`).
  url?: string
}

export function NewRecordTrigger({
  size,
  variant,
  className,
  stopPropagation,
  children,
  schema: schemaOverride,
  resource: resourceOverride,
  defaults,
  url,
}: Props) {
  const ctx = useResourceFormSheet()
  const { inlineForm, open } = useNewRecordSheet(
    schemaOverride,
    resourceOverride
  )

  const schema = schemaOverride ?? ctx.schema
  const resource = resourceOverride ?? ctx.resource

  if (inlineForm) {
    return (
      <Button
        size={size}
        variant={variant}
        className={className}
        onClick={(e: MouseEvent) => {
          if (stopPropagation) e.stopPropagation()
          open(defaults)
        }}
      >
        {children}
      </Button>
    )
  }

  let href = url ?? `/${schema}/resource/${resource}/new`
  if (!url && defaults) {
    const params = new URLSearchParams()
    params.set("defaults", JSON.stringify(defaults))
    href = `${href}?${params.toString()}`
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      nativeButton={false}
      render={
        <Link
          to={href as never}
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation()
          }}
        />
      }
    >
      {children}
    </Button>
  )
}

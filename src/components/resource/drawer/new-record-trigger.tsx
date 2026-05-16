import type { ReactNode } from "react"

import { Link, getRouteApi } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { useDrawerHref } from "#/hooks/use-drawer-href"
import { useInlineFormFlag } from "#/hooks/use-inline-form-flag"

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: string
  children: ReactNode
  schema?: string
  resource?: string
  // Pre-filled field values. Applied to both inline (drawer) and full-page flows.
  // For the link path, callers can either pass `defaults` and let the trigger
  // build the URL, or pass a fully-formed `url`.
  defaults?: Record<string, string>
  // Full URL used for the link (non-inline) path. Defaults to
  // `/<schema>/resource/<resource>/new`.
  url?: string
}

const routeApi = getRouteApi("/$schema/resource/$resource")

export function NewRecordTrigger({
  size,
  variant,
  className,
  children,
  schema: schemaOverride,
  resource: resourceOverride,
  defaults,
  url,
}: Props) {
  const params = routeApi.useParams()
  const schema = schemaOverride ?? params.schema
  const resource = resourceOverride ?? params.resource

  const inlineForm = useInlineFormFlag(schema, resource)
  const drawerLink = useDrawerHref({
    mode: "create",
    defaults,
    schema: schemaOverride,
    resource: resourceOverride,
  })

  if ((inlineForm || schemaOverride) && drawerLink) {
    return (
      <Button
        size={size}
        variant={variant}
        className={className}
        nativeButton={false}
        render={
          <Link
            to={drawerLink.to as never}
            search={drawerLink.search as never}
          />
        }
      >
        {children}
      </Button>
    )
  }

  let href = url ?? `/${schema}/resource/${resource}/new`
  if (!url && defaults) {
    const search = new URLSearchParams()
    search.set("defaults", JSON.stringify(defaults))
    href = `${href}?${search.toString()}`
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      nativeButton={false}
      render={<Link to={href as never} />}
    >
      {children}
    </Button>
  )
}

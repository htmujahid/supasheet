import type { MouseEvent, ReactNode } from "react"

import { Link, getRouteApi } from "@tanstack/react-router"

import { buttonVariants } from "#/components/ui/button"
import type { Button } from "#/components/ui/button"
import { useInlineFormFlag } from "#/hooks/use-inline-form-flag"
import { useSheetHref } from "#/hooks/use-sheet-href"
import { cn } from "#/lib/utils"

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  pk: Record<string, unknown>
  primaryKeyNames: string[]
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: string
  children: ReactNode
  // Optional overrides — when set, the trigger targets this schema/resource
  // instead of the route-level default (e.g. foreign-table rows).
  schema?: string
  resource?: string
  redirect?: string
}

const routeApi = getRouteApi("/$schema/resource/$resource")

export function EditRecordTrigger({
  pk,
  primaryKeyNames,
  size,
  variant,
  className,
  children,
  schema: schemaOverride,
  resource: resourceOverride,
  redirect,
}: Props) {
  const params = routeApi.useParams()
  const schema = schemaOverride ?? params.schema
  const resource = resourceOverride ?? params.resource

  const inlineForm = useInlineFormFlag(schema, resource)
  const sheetLink = useSheetHref({
    mode: "update",
    pk,
    schema: schemaOverride,
    resource: resourceOverride,
  })

  if ((inlineForm || schemaOverride) && sheetLink) {
    return (
      <Link
        className={cn(buttonVariants({ size, variant }), className)}
        to={sheetLink.to as never}
        search={sheetLink.search as never}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
        }}
      >
        {children}
      </Link>
    )
  }

  const resourceId = String(pk[primaryKeyNames[0]] ?? "")

  return (
    <Link
      className={cn(buttonVariants({ size, variant }), className)}
      to="/$schema/resource/$resource/$resourceId/update"
      params={{ schema, resource, resourceId } as never}
      search={redirect ? { redirect } : undefined}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </Link>
  )
}

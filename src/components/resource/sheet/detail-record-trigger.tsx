import type { MouseEvent, ReactNode } from "react"

import { Link, getRouteApi } from "@tanstack/react-router"

import { buttonVariants } from "#/components/ui/button"
import type { Button } from "#/components/ui/button"
import { useSheetHref } from "#/hooks/use-sheet-href"
import { useInlineFormFlag } from "#/hooks/use-inline-form-flag"
import { cn } from "#/lib/utils"

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  pk: Record<string, unknown>
  primaryKeyNames: string[]
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: string
  children: ReactNode
  schema?: string
  resource?: string
}

const routeApi = getRouteApi("/$schema/resource/$resource")

export function DetailRecordTrigger({
  pk,
  primaryKeyNames,
  size,
  variant,
  className,
  children,
  schema: schemaOverride,
  resource: resourceOverride,
}: Props) {
  const params = routeApi.useParams()
  const schema = schemaOverride ?? params.schema
  const resource = resourceOverride ?? params.resource

  const inlineForm = useInlineFormFlag(schema, resource)
  const sheetLink = useSheetHref({
    mode: "detail",
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
      to="/$schema/resource/$resource/$resourceId/detail"
      params={{ schema, resource, resourceId } as never}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </Link>
  )
}

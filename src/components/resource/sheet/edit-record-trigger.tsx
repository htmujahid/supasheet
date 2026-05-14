import type { MouseEvent, ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { Button, buttonVariants } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import {
  useEditRecordSheet,
  useResourceFormSheet,
} from "./resource-form-sheet-provider"

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
  const ctx = useResourceFormSheet()
  const { inlineForm, open } = useEditRecordSheet(
    schemaOverride,
    resourceOverride
  )

  const schema = schemaOverride ?? ctx.schema
  const resource = resourceOverride ?? ctx.resource

  if (inlineForm || schemaOverride) {
    return (
      <Button
        size={size}
        variant={variant}
        className={className}
        onClick={(e: MouseEvent) => {
          e.stopPropagation()
          open(pk)
        }}
      >
        {children}
      </Button>
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

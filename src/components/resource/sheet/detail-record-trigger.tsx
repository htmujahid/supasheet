import type { MouseEvent, ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { Button, buttonVariants } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import {
  useDetailRecordSheet,
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
  schema?: string
  resource?: string
}

function encodePkSplat(pk: Record<string, unknown>, primaryKeyNames: string[]) {
  return primaryKeyNames
    .map((name) => encodeURIComponent(String(pk[name])))
    .join("/")
}

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
  const ctx = useResourceFormSheet()
  const { inlineForm, open } = useDetailRecordSheet(
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

  const splat = encodePkSplat(pk, primaryKeyNames)

  return (
    <Link
      className={cn(buttonVariants({ size, variant }), className)}
      to="/$schema/resource/$resource/detail/$"
      params={{ schema, resource, _splat: splat } as never}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </Link>
  )
}

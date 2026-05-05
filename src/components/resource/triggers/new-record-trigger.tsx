import type { MouseEvent, ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"

import {
  useNewRecordSheet,
  useResourceFormSheet,
} from "../resource-form-sheet-provider"

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: string
  stopPropagation?: boolean
  children: ReactNode
  schema?: string
  resource?: string
  redirect?: string
}

export function NewRecordTrigger({
  size,
  variant,
  className,
  stopPropagation,
  children,
  schema: schemaOverride,
  resource: resourceOverride,
  redirect,
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
          open()
        }}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      nativeButton={false}
      render={
        <Link
          to="/$schema/resource/$resource/new"
          params={{ schema, resource } as never}
          search={redirect ? { redirect } : undefined}
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

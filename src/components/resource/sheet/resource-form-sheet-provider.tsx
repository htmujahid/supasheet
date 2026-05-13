import { createContext, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { getRouteApi } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import type { TableMetadata } from "#/lib/database-meta.types"
import { tableSchemaQueryOptions } from "#/lib/supabase/data/resource"

import { ResourceFormSheet } from "./resource-form-sheet"
import { ResourceImportSheet } from "./resource-import-sheet"

type SheetState =
  | { open: false }
  | {
      open: true
      mode: "create"
      schema: string
      resource: string
      defaults?: Record<string, string>
    }
  | {
      open: true
      mode: "update"
      schema: string
      resource: string
      pk: Record<string, unknown>
    }
  | {
      open: true
      mode: "import"
      schema: string
      resource: string
    }

type OpenNewOptions = {
  schema?: string
  resource?: string
  defaults?: Record<string, string>
}

type OpenEditOptions = {
  pk: Record<string, unknown>
  schema?: string
  resource?: string
}

type ContextValue = {
  schema: string
  resource: string
  openNew: (options?: OpenNewOptions) => void
  openEdit: (options: OpenEditOptions) => void
  openImport: (options?: { schema?: string; resource?: string }) => void
  close: () => void
}

const ResourceFormSheetContext = createContext<ContextValue | null>(null)

const routeApi = getRouteApi("/$schema/resource/$resource")

export function ResourceFormSheetProvider({
  children,
}: {
  children: ReactNode
}) {
  const { schema: defaultSchema, resource: defaultResource } =
    routeApi.useParams()
  const [state, setState] = useState<SheetState>({ open: false })

  const value = useMemo<ContextValue>(
    () => ({
      schema: defaultSchema,
      resource: defaultResource,
      openNew: (options) =>
        setState({
          open: true,
          mode: "create",
          schema: options?.schema ?? defaultSchema,
          resource: options?.resource ?? defaultResource,
          defaults: options?.defaults,
        }),
      openEdit: (options) =>
        setState({
          open: true,
          mode: "update",
          schema: options.schema ?? defaultSchema,
          resource: options.resource ?? defaultResource,
          pk: options.pk,
        }),
      openImport: (options) =>
        setState({
          open: true,
          mode: "import",
          schema: options?.schema ?? defaultSchema,
          resource: options?.resource ?? defaultResource,
        }),
      close: () => setState({ open: false }),
    }),
    [defaultSchema, defaultResource]
  )

  const onOpenChange = (next: boolean) => {
    if (!next) setState({ open: false })
  }

  return (
    <ResourceFormSheetContext.Provider value={value}>
      {children}
      {state.open && state.mode === "create" && (
        <ResourceFormSheet
          mode="create"
          schema={state.schema}
          resource={state.resource}
          defaults={state.defaults}
          open
          onOpenChange={onOpenChange}
        />
      )}
      {state.open && state.mode === "update" && (
        <ResourceFormSheet
          mode="update"
          schema={state.schema}
          resource={state.resource}
          pk={state.pk}
          open
          onOpenChange={onOpenChange}
        />
      )}
      {state.open && state.mode === "import" && (
        <ResourceImportSheet
          schema={state.schema}
          resource={state.resource}
          open
          onOpenChange={onOpenChange}
        />
      )}
    </ResourceFormSheetContext.Provider>
  )
}

export function useResourceFormSheet(): ContextValue {
  const ctx = useContext(ResourceFormSheetContext)
  if (!ctx) {
    throw new Error(
      "useResourceFormSheet must be used within a ResourceFormSheetProvider"
    )
  }
  return ctx
}

function useInlineFormFlag(schema: string, resource: string) {
  const { data: tableSchema } = useQuery({
    ...tableSchemaQueryOptions(schema as never, resource as never),
    enabled: Boolean(schema && resource),
  })
  return useMemo(() => {
    try {
      const meta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
      return meta.inlineForm === true
    } catch {
      return false
    }
  }, [tableSchema?.comment])
}

export function useNewRecordSheet(schema?: string, resource?: string) {
  const ctx = useResourceFormSheet()
  const targetSchema = schema ?? ctx.schema
  const targetResource = resource ?? ctx.resource
  const inlineForm = useInlineFormFlag(targetSchema, targetResource)
  return {
    inlineForm,
    open: (defaults?: Record<string, string>) =>
      ctx.openNew({ schema, resource, defaults }),
  }
}

export function useEditRecordSheet(schema?: string, resource?: string) {
  const ctx = useResourceFormSheet()
  const targetSchema = schema ?? ctx.schema
  const targetResource = resource ?? ctx.resource
  const inlineForm = useInlineFormFlag(targetSchema, targetResource)
  return {
    inlineForm,
    open: (pk: Record<string, unknown>) =>
      ctx.openEdit({ pk, schema, resource }),
  }
}

export function useImportSheet(schema?: string, resource?: string) {
  const ctx = useResourceFormSheet()
  return {
    open: () => ctx.openImport({ schema, resource }),
  }
}

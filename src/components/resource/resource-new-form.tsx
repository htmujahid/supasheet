import { getRouteApi, useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import { insertResourceMutationOptions } from "#/lib/supabase/data/resource"

import { useAppForm } from "./form-hook"
import { ResourceFormLayout } from "./resource-form-layout"
import {
  buildCreatePayload,
  getCreateInitialValue,
  isSkippedForCreate,
} from "./resource-form-utils"

const routeApi = getRouteApi("/$schema/resource/$resource/new")

export function ResourceNewForm({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema
}) {
  const schema = tableSchema.schema
  const table = tableSchema.name

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { redirect } = routeApi.useSearch()
  const safeRedirect =
    redirect?.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : undefined

  const writableCols = columnsSchema.filter((col) => !isSkippedForCreate(col))

  const defaultValues = Object.fromEntries(
    writableCols.map((col) => [col.name ?? col.id, getCreateInitialValue(col)])
  )

  const { mutateAsync: insertRow } = useMutation(
    insertResourceMutationOptions(schema, table)
  )

  const primaryKeys = (tableSchema.primary_keys ?? []) as PrimaryKey[]

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, meta }) => {
      const payload = buildCreatePayload(value, writableCols)
      let inserted: Record<string, unknown> | null = null
      try {
        inserted = await insertRow(payload)
      } catch (error: any) {
        toast.error(error?.message || "An error occurred")
        console.error(error)
        return
      }
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, table],
      })
      toast.success("Record created")

      const splat =
        inserted && primaryKeys.length
          ? primaryKeys
              .map((key) => encodeURIComponent(String(inserted[key.name])))
              .join("/")
          : ""

      const target = (meta as { target?: string } | undefined)?.target ?? "stay"

      if (target === "stay" && splat) {
        navigate({
          to: "/$schema/resource/$resource/update/$",
          params: { schema, resource: table, _splat: splat },
          search: safeRedirect ? { redirect: safeRedirect } : {},
        })
      } else if (safeRedirect) {
        navigate({ to: safeRedirect })
      } else {
        navigate({
          to: "/$schema/resource/$resource",
          params: { schema, resource: table },
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <ResourceFormLayout
        tableSchema={tableSchema}
        writableCols={writableCols}
        form={form}
        mode="create"
        headerTitle="New record"
        redirect={safeRedirect}
      />
    </form>
  )
}

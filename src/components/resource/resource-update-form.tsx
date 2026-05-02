import { getRouteApi, useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import { updateResourceMutationOptions } from "#/lib/supabase/data/resource"

import { useAppForm } from "./form-hook"
import { ResourceFormLayout } from "./resource-form-layout"
import {
  buildUpdatePayload,
  getUpdateInitialValue,
  isSkippedForUpdate,
} from "./resource-form-utils"

const routeApi = getRouteApi("/$schema/resource/$resource/update/$")

interface ResourceUpdateFormProps {
  columnsSchema: ColumnSchema[]
  primaryKeys: PrimaryKey[]
  record: Record<string, unknown>
  tableSchema: TableSchema
}

export function ResourceUpdateForm({
  columnsSchema,
  primaryKeys,
  record,
  tableSchema,
}: ResourceUpdateFormProps) {
  const schema = tableSchema?.schema
  const resource = tableSchema?.name

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { redirect } = routeApi.useSearch()
  const safeRedirect =
    redirect?.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : undefined

  const pk = Object.fromEntries(
    primaryKeys.map((k) => [k.name, record[k.name]])
  )

  const primaryKeyCols = columnsSchema.filter((col) =>
    primaryKeys.some((key) => key.name === col.name)
  )
  const editableCols = columnsSchema.filter(
    (col) => !isSkippedForUpdate(col, primaryKeys) && (col.is_updatable ?? true)
  )

  const defaultValues = Object.fromEntries(
    editableCols.map((col) => [
      col.name ?? col.id,
      getUpdateInitialValue(col, record),
    ])
  )

  const { mutateAsync: updateRow } = useMutation(
    updateResourceMutationOptions(schema, resource)
  )

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, meta }) => {
      const data = buildUpdatePayload(value, editableCols)
      await updateRow({ pk, data })
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "supasheet",
          "resource-data",
          schema,
          resource,
          "single",
          pk,
        ],
      })
      toast.success("Record updated")
      if ((meta as { target?: string } | undefined)?.target === "close") {
        if (safeRedirect) {
          navigate({ to: safeRedirect })
        } else {
          navigate({
            to: "/$schema/resource/$resource",
            params: { schema, resource },
          })
        }
      }
    },
  })

  const primaryKeyDisplay = primaryKeyCols.map((col) => {
    const name = col.name ?? col.id ?? ""
    return { name, value: String(record[name] ?? "") }
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
        writableCols={editableCols}
        form={form}
        mode="update"
        primaryKeyDisplay={primaryKeyDisplay}
        headerTitle="Edit record"
        redirect={safeRedirect}
      />
    </form>
  )
}

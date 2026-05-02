import { useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { insertResourceMutationOptions } from "#/lib/supabase/data/resource"

import { useAppForm } from "./form-hook"
import { ResourceFormLayout } from "./resource-form-layout"
import {
  buildCreatePayload,
  getCreateInitialValue,
  isSkippedForCreate,
} from "./resource-form-utils"

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

  const writableCols = columnsSchema.filter((col) => !isSkippedForCreate(col))

  const defaultValues = Object.fromEntries(
    writableCols.map((col) => [col.name ?? col.id, getCreateInitialValue(col)])
  )

  const { mutateAsync: insertRow } = useMutation(
    insertResourceMutationOptions(schema, table)
  )

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload = buildCreatePayload(value, writableCols)
      try {
        await insertRow(payload)
      } catch (error: any) {
        toast.error(error?.message || "An error occurred")
        console.error(error)
        return
      }
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, table],
      })
      toast.success("Record created")
      navigate({
        to: "/$schema/resource/$resource",
        params: { schema: schema, resource: table },
      })
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
        onCancel={() =>
          navigate({
            to: "/$schema/resource/$resource",
            params: { schema, resource: table },
          })
        }
        submitLabel="Create"
        submittingLabel="Creating…"
      />
    </form>
  )
}

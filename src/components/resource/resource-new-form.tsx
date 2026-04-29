import { useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import type { ColumnSchema, TableMetadata, TableSchema } from "#/lib/database-meta.types"
import { insertResourceMutationOptions } from "#/lib/supabase/data/resource"

import { ResourceFormField } from "./fields/resource-form-field"
import {
  buildCreatePayload,
  getCreateInitialValue,
  isSkippedForCreate,
} from "./resource-form-utils"
import { useAppForm } from "./form-hook"

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

  const tableMeta = JSON.parse(tableSchema.comment ?? "{}") as TableMetadata
  const columnsMeta = tableMeta.columns

  const writableCols = columnsSchema.filter(
    (col) => !isSkippedForCreate(col, columnsMeta)
  )

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
    <Card>
      <CardHeader className="border-b">
        <CardTitle>New record</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <CardContent className="space-y-4 py-4">
          {writableCols.map((col) => (
            <ResourceFormField
              key={col.id}
              columnSchema={col}
              tableSchema={tableSchema}
              form={form}
            />
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/$schema/resource/$resource",
                params: {
                  schema: tableSchema.schema,
                  resource: tableSchema.name,
                },
              })
            }
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(s) => ({
              isSubmitting: s.isSubmitting,
              canSubmit: s.canSubmit,
            })}
          >
            {({ isSubmitting, canSubmit }) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating…" : "Create"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  )
}

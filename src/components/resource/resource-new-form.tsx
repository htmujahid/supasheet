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
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { insertResourceMutationOptions } from "#/lib/supabase/data/resource"

import { ResourceFormField } from "./fields/resource-form-field"
import { useAppForm } from "./form-hook"

function isSkippedForCreate(col: ColumnSchema): boolean {
  return (col.is_generated ?? false) || (col.is_identity ?? false)
}

function getInitialValue(col: ColumnSchema): unknown {
  // Arrays default to empty array so ArrayField renders correctly
  if (col.data_type === "ARRAY") return []
  return ""
}

function buildPayload(
  value: Record<string, unknown>,
  cols: ColumnSchema[]
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) {
    if (v === "" || v === null || v === undefined) continue
    const col = cols.find((c) => (c.name ?? c.id) === k)
    if (
      col &&
      (col.format === "json" || col.format === "jsonb") &&
      typeof v === "string"
    ) {
      try {
        payload[k] = JSON.parse(v)
      } catch {
        payload[k] = v
      }
    } else {
      payload[k] = v
    }
  }
  return payload
}

export function ResourceNewForm({
  columnsSchema,
  tableSchema,
}: {
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const writableCols = columnsSchema.filter((col) => !isSkippedForCreate(col))

  const defaultValues = Object.fromEntries(
    writableCols.map((col) => [col.name ?? col.id, getInitialValue(col)])
  )

  const { mutateAsync: insertRow } = useMutation(
    insertResourceMutationOptions(tableSchema.schema, tableSchema.name)
  )

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload = buildPayload(value, writableCols)
      await insertRow(payload)
      queryClient.invalidateQueries({
        queryKey: [
          "supasheet",
          "resource-data",
          tableSchema.schema,
          tableSchema.name,
        ],
      })
      toast.success("Record created")
      navigate({
        to: "/$schema/resource/$resource",
        params: { schema: tableSchema.schema, resource: tableSchema.name },
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

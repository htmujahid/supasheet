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
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import { updateResourceMutationOptions } from "#/lib/supabase/data/resource"

import { ResourceFormField } from "./fields/resource-form-field"
import { useAppForm } from "./form-hook"

function isSkippedForUpdate(
  col: ColumnSchema,
  primaryKeys: PrimaryKey[]
): boolean {
  if (col.is_generated ?? false) return true
  if (primaryKeys.some((pk) => pk.name === col.name)) return true
  return false
}

function getInitialValue(
  col: ColumnSchema,
  record: Record<string, unknown>
): unknown {
  const val = record[col.name ?? col.id]
  if (val === null || val === undefined) return ""
  if (col.data_type === "ARRAY") return Array.isArray(val) ? val : []
  if (col.format === "json" || col.format === "jsonb") {
    return typeof val === "string" ? val : JSON.stringify(val, null, 2)
  }
  return val
}

function buildPayload(
  value: Record<string, unknown>,
  cols: ColumnSchema[]
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) {
    const col = cols.find((c) => (c.name ?? c.id) === k)
    if (v === "" || v === null || v === undefined) {
      payload[k] = null
    } else if (
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

interface ResourceUpdateFormProps {
  schema: string
  resource: string
  columnsSchema: ColumnSchema[]
  primaryKeys: PrimaryKey[]
  record: Record<string, unknown>
  tableSchema: TableSchema | null
}

export function ResourceUpdateForm({
  schema,
  resource,
  columnsSchema,
  primaryKeys,
  record,
  tableSchema,
}: ResourceUpdateFormProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const pk = Object.fromEntries(
    primaryKeys.map((k) => [k.name, record[k.name]])
  )

  const readonlyCols = columnsSchema.filter((col) =>
    primaryKeys.some((key) => key.name === col.name)
  )
  const editableCols = columnsSchema.filter(
    (col) => !isSkippedForUpdate(col, primaryKeys) && (col.is_updatable ?? true)
  )

  const defaultValues = Object.fromEntries(
    editableCols.map((col) => [
      col.name ?? col.id,
      getInitialValue(col, record),
    ])
  )

  const { mutateAsync: updateRow } = useMutation(
    updateResourceMutationOptions(schema, resource)
  )

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const data = buildPayload(value, editableCols)
      await updateRow({ pk, data })
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource],
      })
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource, "single", pk],
      })
      toast.success("Record updated")
      navigate({
        to: "/$schema/resource/$resource",
        params: { schema, resource },
      })
    },
  })

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Edit record</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <CardContent className="space-y-4 py-4">
          {readonlyCols.map((col) => {
            const name = col.name ?? col.id
            return (
              <Field key={name}>
                <FieldLabel>{name}</FieldLabel>
                <Input
                  value={String(record[name] ?? "")}
                  disabled
                  className="font-mono text-xs text-muted-foreground"
                />
              </Field>
            )
          })}
          {editableCols.map((col) => (
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
                params: { schema, resource },
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
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  )
}

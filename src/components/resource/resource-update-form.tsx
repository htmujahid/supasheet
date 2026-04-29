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
  TableMetadata,
  TableSchema,
} from "#/lib/database-meta.types"
import { updateResourceMutationOptions } from "#/lib/supabase/data/resource"

import { ResourceFormField } from "./fields/resource-form-field"
import {
  buildUpdatePayload,
  getUpdateInitialValue,
  isSkippedForUpdate,
} from "./resource-form-utils"
import { useAppForm } from "./form-hook"

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

  const pk = Object.fromEntries(
    primaryKeys.map((k) => [k.name, record[k.name]])
  )

  const tableMeta = JSON.parse(tableSchema.comment ?? "{}") as TableMetadata
  const columnsMeta = tableMeta.columns

  const primaryKeyCols = columnsSchema.filter((col) =>
    primaryKeys.some((key) => key.name === col.name)
  )
  const editableCols = columnsSchema.filter(
    (col) =>
      !isSkippedForUpdate(col, primaryKeys, columnsMeta) &&
      (col.is_updatable ?? true)
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
    onSubmit: async ({ value }) => {
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
          {primaryKeyCols.map((col) => {
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

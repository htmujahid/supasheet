import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { SheetFooter } from "#/components/ui/sheet"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import {
  insertResourceMutationOptions,
  updateResourceMutationOptions,
} from "#/lib/supabase/data/resource"

import { ResourceFormField } from "../fields/resource-form-field"
import { useAppForm } from "../form-hook"
import {
  buildCreatePayload,
  buildUpdatePayload,
  getCreateInitialValue,
  getUpdateInitialValue,
  isSkippedForCreate,
  isSkippedForUpdate,
} from "../resource-form-utils"

type Mode = "create" | "update"

export function ResourceFormSheetContent({
  mode,
  tableSchema,
  columnsSchema,
  record,
  defaults,
  onClose,
}: {
  mode: Mode
  tableSchema: TableSchema
  columnsSchema: ColumnSchema[]
  record: Record<string, unknown> | null
  defaults?: Record<string, string>
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const schema = tableSchema.schema
  const resource = tableSchema.name
  const primaryKeys = (tableSchema.primary_keys ?? []) as PrimaryKey[]

  const writableCols =
    mode === "create"
      ? columnsSchema.filter((col) => !isSkippedForCreate(col))
      : columnsSchema.filter(
          (col) =>
            !isSkippedForUpdate(col, primaryKeys) && (col.is_updatable ?? true)
        )

  const primaryKeyCols =
    mode === "update"
      ? columnsSchema.filter((col) =>
          primaryKeys.some((key) => key.name === col.name)
        )
      : []

  const defaultValues = Object.fromEntries(
    writableCols.map((col) => {
      const key = col.name ?? col.id
      if (mode === "create") {
        const override = defaults?.[key]
        return [
          key,
          override !== undefined ? override : getCreateInitialValue(col),
        ]
      }
      return [key, getUpdateInitialValue(col, record ?? {})]
    })
  )

  const insertMutation = useMutation(
    insertResourceMutationOptions(schema, resource)
  )
  const updateMutation = useMutation(
    updateResourceMutationOptions(schema, resource)
  )

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          const payload = buildCreatePayload(value, writableCols)
          await insertMutation.mutateAsync(payload)
          toast.success("Record created")
        } else {
          const data = buildUpdatePayload(value, writableCols)
          const pk = Object.fromEntries(
            primaryKeys.map((k) => [
              k.name,
              (record as Record<string, unknown>)[k.name],
            ])
          )
          await updateMutation.mutateAsync({ pk, data })
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
        }
        queryClient.invalidateQueries({
          queryKey: ["supasheet", "resource-data", schema, resource],
        })
        onClose()
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "An error occurred"
        toast.error(message)
        console.error(error)
      }
    },
  })

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {mode === "update" &&
          primaryKeyCols.map((col) => {
            const name = col.name ?? col.id ?? ""
            return (
              <Field key={name}>
                <FieldLabel>{name}</FieldLabel>
                <Input
                  value={String(
                    (record as Record<string, unknown>)[name] ?? ""
                  )}
                  disabled
                  className="font-mono text-xs text-muted-foreground"
                />
              </Field>
            )
          })}
        {writableCols.map((col) => (
          <ResourceFormField
            key={col.id}
            columnSchema={col}
            tableSchema={tableSchema}
            form={form}
          />
        ))}
      </div>
      <SheetFooter className="flex-row justify-end border-t">
        <Button type="button" variant="outline" onClick={onClose}>
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
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          )}
        </form.Subscribe>
      </SheetFooter>
    </form>
  )
}

import { Suspense } from "react"

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import { Skeleton } from "#/components/ui/skeleton"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
} from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import {
  columnsSchemaQueryOptions,
  insertResourceMutationOptions,
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
  updateResourceMutationOptions,
} from "#/lib/supabase/data/resource"

import { ResourceFormField } from "./fields/resource-form-field"
import { useAppForm } from "./form-hook"
import {
  buildCreatePayload,
  buildUpdatePayload,
  getCreateInitialValue,
  getUpdateInitialValue,
  isSkippedForCreate,
  isSkippedForUpdate,
} from "./resource-form-utils"

type Mode = "create" | "update"

type Props =
  | {
      mode: "create"
      schema: string
      resource: string
      open: boolean
      onOpenChange: (open: boolean) => void
    }
  | {
      mode: "update"
      schema: string
      resource: string
      pk: Record<string, unknown>
      open: boolean
      onOpenChange: (open: boolean) => void
    }

export function ResourceFormSheet(props: Props) {
  const { mode, schema, resource, open, onOpenChange } = props

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 sm:max-w-lg!"
      >
        <SheetHeader className="border-b">
          <SheetTitle>
            {mode === "create" ? "New record" : "Edit record"}
          </SheetTitle>
          <SheetDescription>{formatTitle(resource)}</SheetDescription>
        </SheetHeader>
        <Suspense fallback={<SheetBodySkeleton />}>
          {mode === "create" ? (
            <CreateBody
              schema={schema}
              resource={resource}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <UpdateBody
              schema={schema}
              resource={resource}
              pk={props.pk}
              onClose={() => onOpenChange(false)}
            />
          )}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

function SheetBodySkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}

function CreateBody({
  schema,
  resource,
  onClose,
}: {
  schema: string
  resource: string
  onClose: () => void
}) {
  const { data: tableSchema } = useSuspenseQuery(
    tableSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: columnsSchema } = useSuspenseQuery(
    columnsSchemaQueryOptions(schema as never, resource as never)
  )

  if (!tableSchema || !columnsSchema?.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
        Schema unavailable.
      </div>
    )
  }

  return (
    <FormBody
      mode="create"
      tableSchema={tableSchema as TableSchema}
      columnsSchema={columnsSchema as ColumnSchema[]}
      record={null}
      onClose={onClose}
    />
  )
}

function UpdateBody({
  schema,
  resource,
  pk,
  onClose,
}: {
  schema: string
  resource: string
  pk: Record<string, unknown>
  onClose: () => void
}) {
  const { data: tableSchema } = useSuspenseQuery(
    tableSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: columnsSchema } = useSuspenseQuery(
    columnsSchemaQueryOptions(schema as never, resource as never)
  )
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema as never, resource as never, pk)
  )

  if (!tableSchema || !columnsSchema?.length || !record) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
        Record unavailable.
      </div>
    )
  }

  return (
    <FormBody
      mode="update"
      tableSchema={tableSchema as TableSchema}
      columnsSchema={columnsSchema as ColumnSchema[]}
      record={record}
      onClose={onClose}
    />
  )
}

function FormBody({
  mode,
  tableSchema,
  columnsSchema,
  record,
  onClose,
}: {
  mode: Mode
  tableSchema: TableSchema
  columnsSchema: ColumnSchema[]
  record: Record<string, unknown> | null
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
    writableCols.map((col) => [
      col.name ?? col.id,
      mode === "create"
        ? getCreateInitialValue(col)
        : getUpdateInitialValue(col, record ?? {}),
    ])
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

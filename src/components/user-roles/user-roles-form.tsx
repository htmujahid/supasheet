import { useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"

import { ResourceFormField } from "#/components/resource/fields/resource-form-field"
import { useAppForm } from "#/components/resource/form-hook"
import type { ResourceFormApi } from "#/components/resource/form-hook"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import { createUserRoleMutationOptions } from "#/lib/supabase/data/core"
import type { AppRole } from "#/lib/supabase/data/core"

function isSkippedForCreate(col: ColumnSchema): boolean {
  return (col.is_generated ?? false) || (col.is_identity ?? false)
}

function getInitialValue(col: ColumnSchema): unknown {
  if (col.data_type === "ARRAY") return []
  return ""
}

interface UserRolesFormProps {
  columnsSchema: ColumnSchema[]
  tableSchema: TableSchema | null
}

export function UserRolesForm({
  columnsSchema,
  tableSchema,
}: UserRolesFormProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const writableCols = columnsSchema.filter((col) => !isSkippedForCreate(col))

  const { mutateAsync: createUserRole } = useMutation({
    ...createUserRoleMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supasheet", "user_roles"] })
      toast.success("User role created")
      navigate({
        to: "/core/user_roles",
      })
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create user role"
      )
    },
  })

  const defaultValues = Object.fromEntries(
    writableCols.map((col) => [col.name ?? col.id, getInitialValue(col)])
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: ({ value }) => {
        const v = value as Record<string, unknown>
        const fields: Partial<Record<string, string>> = {}
        for (const col of writableCols) {
          const name = col.name ?? col.id
          const required = col.is_nullable === false && !col.default_value
          if (!required) continue
          const raw = v[name]
          const empty =
            raw === null ||
            raw === undefined ||
            (typeof raw === "string" && raw.trim() === "")
          if (empty) {
            fields[name] = `${formatTitle(name)} is required`
          }
        }
        if (Object.keys(fields).length > 0) {
          return { fields }
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      const v = value as Record<string, unknown>
      await createUserRole({
        user_id: v.user_id as string,
        role: v.role as AppRole,
      })
    },
  })

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>New user role</CardTitle>
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
              form={form as ResourceFormApi}
            />
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/core/user_roles",
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

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field"
import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  DatabaseSchemas,
  Relationship,
  TableSchema,
} from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { ColumnMetadata } from "#/types/fields"

import type { ResourceFormApi } from "../form-hook"
import { useFieldContext } from "../form-hook"
import { AllFields } from "./all-fields"
import { ArrayField } from "./array-field"
import { AvatarField } from "./avatar-field"
import { FileField } from "./file-field"
import { ForeignKeyField } from "./foreign-key-field"

function FieldErrors() {
  const field = useFieldContext<unknown>()
  return (
    <FieldError
      errors={field.state.meta.errors.map((e: unknown) => ({
        message: String(e),
      }))}
    />
  )
}

export function ResourceFormField<S extends DatabaseSchemas>({
  columnSchema,
  tableSchema,
  form,
}: {
  columnSchema: ColumnSchema<S>
  tableSchema: TableSchema<S> | null
  form: ResourceFormApi
}) {
  let columnMetadata: ColumnMetadata

  if (columnSchema.data_type === "ARRAY") {
    let data_type = columnSchema.actual_type?.toString().slice(1) ?? null

    if ((columnSchema.enums as string[])?.length) {
      data_type = "USER-DEFINED"
    }

    columnMetadata = getColumnMetadata(tableSchema, {
      ...columnSchema,
      data_type,
    })
  } else {
    columnMetadata = getColumnMetadata(tableSchema, columnSchema)
  }

  if (columnMetadata.isMetadata) return null;

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (r) =>
      r.source_column_name === columnSchema.name &&
      r.source_schema === columnSchema.schema
  )

  const name = columnSchema.name as string

  return (
    <form.AppField key={columnSchema.id} name={name}>
      {() => (
        <Field>
          <FieldLabel>
            {columnMetadata.icon} {formatTitle(columnSchema.name ?? "")}{" "}
            {columnMetadata.required && (
              <span className="text-destructive">*</span>
            )}
          </FieldLabel>
          <div>
            {columnSchema.format === "file" ? (
              <FileField
                columnMetadata={columnMetadata}
                columnSchema={columnSchema}
              />
            ) : columnSchema.format === "avatar" ? (
              <AvatarField
                columnMetadata={columnMetadata}
                columnSchema={columnSchema}
              />
            ) : columnSchema.data_type === "ARRAY" ? (
              <ArrayField form={form} columnMetadata={columnMetadata} />
            ) : relationship ? (
              <ForeignKeyField
                columnMetadata={columnMetadata}
                relationship={relationship}
              />
            ) : (
              <AllFields columnMetadata={columnMetadata} />
            )}
          </div>
          {columnMetadata.defaultValue && (
            <FieldDescription>
              DEFAULT: {columnMetadata.defaultValue}
            </FieldDescription>
          )}
          <FieldErrors />
        </Field>
      )}
    </form.AppField>
  )
}

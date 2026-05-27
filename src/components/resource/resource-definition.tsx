import type {
  ColumnSchema,
  Relationship,
  ResourceSchema,
  TableMetadata,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"

import { ResourceDefinitionField } from "./resource-definition-field"
import { ResourceDefinitionHeader } from "./resource-definition-header"
import { ResourceDefinitionUsedBy } from "./resource-definition-used-by"
import type { FieldRow, LinkedResource } from "./resource-definition-utils"
import { buildFieldRow } from "./resource-definition-utils"

interface ResourceDefinitionProps {
  resource: string
  resourceSchema: ResourceSchema
  columnsSchema: ColumnSchema[]
}

export function ResourceDefinition({
  resource,
  resourceSchema,
  columnsSchema,
}: ResourceDefinitionProps) {
  const isTable = isTableSchema(resourceSchema)
  const meta = (
    resourceSchema?.comment ? JSON.parse(resourceSchema.comment) : {}
  ) as TableMetadata
  const friendlyName = meta.name ?? formatTitle(resourceSchema.name ?? resource)
  const relationships: Relationship[] =
    (isTable ? resourceSchema.relationships : null) ?? []
  const primaryKeys = (isTable ? resourceSchema.primary_keys : null) ?? []
  const primaryKeyNames = new Set(primaryKeys.map((pk) => pk.name))

  const outgoingByColumn = new Map<string, Relationship>()
  const incomingByKey = new Map<string, LinkedResource>()
  for (const rel of relationships) {
    const isOutgoing =
      rel.source_schema === resourceSchema.schema &&
      rel.source_table_name === resourceSchema.name
    if (isOutgoing) {
      outgoingByColumn.set(rel.source_column_name, rel)
    } else {
      const key = `${rel.source_schema}.${rel.source_table_name}`
      if (!incomingByKey.has(key)) {
        incomingByKey.set(key, {
          schema: rel.source_schema,
          name: rel.source_table_name,
          label: formatTitle(rel.source_table_name),
        })
      }
    }
  }

  const fields = columnsSchema
    .map((column) =>
      buildFieldRow(
        column,
        column.name ? outgoingByColumn.get(column.name) : undefined,
        primaryKeyNames
      )
    )
    .filter((row): row is FieldRow => row !== null)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <ResourceDefinitionHeader
        name={friendlyName}
        description={meta.description}
        icon={meta.icon}
        recordCount={isTable ? resourceSchema.live_rows_estimate : null}
      />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Fields ({fields.length})</h3>
        <div className="divide-y rounded-lg border bg-card">
          {fields.map((field) => (
            <ResourceDefinitionField key={field.id} field={field} />
          ))}
          <ResourceDefinitionUsedBy
            resources={Array.from(incomingByKey.values())}
          />
        </div>
      </section>
    </div>
  )
}

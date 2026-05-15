import { Editor } from "#/components/blocks/editor-md/editor"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Label } from "#/components/ui/label"
import { Separator } from "#/components/ui/separator"
import { getColumnMetadata } from "#/lib/columns"
import type {
  ColumnSchema,
  ResourceSchema,
  TableMetadata,
} from "#/lib/database-meta.types"
import { getMetaFields, isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { FileObject } from "#/types/fields"

import { AllCells } from "../cells/all-cells"
import { ResourceAvatarDisplay } from "./resource-avatar-display"
import { ResourceFileDisplay } from "./resource-file-display"

export function ResourceDetailView({
  resourceSchema,
  columnsSchema,
  singleResourceData,
}: {
  resourceSchema: ResourceSchema
  columnsSchema: ColumnSchema[]
  singleResourceData: Record<string, unknown>
}) {
  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null
  if (Object.keys(singleResourceData).length === 0) return null
  const detailColumns =
    columnsSchema?.filter((column) => {
      const name = column.name as string
      return !getMetaFields(resourceSchema).includes(name)
    }) ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>
              {(JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata)
                .name ?? formatTitle(resourceSchema.name as string)}
            </CardTitle>
            <CardDescription>
              View resource details and properties
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {detailColumns.map((column, index) => {
          const value =
            singleResourceData?.[column.name as keyof typeof singleResourceData]

          const columnMetadata = getColumnMetadata(tableSchema, column)

          return (
            <div key={column.id}>
              <div className="flex items-start gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Label className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {columnMetadata.icon} {formatTitle(columnMetadata.name)}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {value ? (
                      columnMetadata.variant === "rich_text" ? (
                        <Editor
                          name={columnMetadata.name}
                          value={value as string}
                          disabled
                        />
                      ) : columnMetadata.variant === "file" ? (
                        <ResourceFileDisplay value={value as FileObject[]} />
                      ) : columnMetadata.variant === "avatar" ? (
                        <ResourceAvatarDisplay
                          value={(value as FileObject | null) ?? null}
                        />
                      ) : (
                        <AllCells
                          columnMetadata={columnMetadata}
                          value={value}
                        />
                      )
                    ) : (
                      <div className="text-muted">N/A</div>
                    )}
                  </div>
                </div>
              </div>
              {index < detailColumns.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

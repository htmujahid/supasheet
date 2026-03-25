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
import { METADATA_COLUMNS } from "#/config/database.config"
import { getColumnMetadata } from "#/lib/columns"
import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"

import { AllCells } from "../cells/all-cells"

export function ResourceDetailView({
  tableSchema,
  columnsSchema,
  singleResourceData,
}: {
  tableSchema: TableSchema
  columnsSchema: ColumnSchema[]
  singleResourceData: Record<string, unknown>
}) {
  if (Object.keys(singleResourceData).length === 0) return null
  const detailColumns =
    columnsSchema?.filter((column) => {
      return !METADATA_COLUMNS.includes(column.name as string)
    }) ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>{formatTitle(tableSchema.name as string)}</CardTitle>
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
                    {columnMetadata.icon} {formatTitle(column.name as string)}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {value ? (
                      columnMetadata.variant === "rich_text" ? (
                        <Editor
                          name={columnMetadata.label}
                          value={value as string}
                          disabled
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

import { DatabaseIcon, Edit2 } from "lucide-react";

import { Editor } from "@/components/blocks/editor-md/editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SheetTrigger } from "@/components/ui/sheet";
import { METADATA_COLUMNS } from "@/config/database.config";
import { ColumnSchema, TableSchema } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

import { getColumnMetadata } from "../../lib/columns";
import { loadResourcePermissions } from "../../lib/loaders";
import { AllCells } from "../cells/all-cells";
import { ResourceSheet } from "../resource-sheet";

export async function ResourceDetailView({
  tableSchema,
  columnsSchema,
  singleResourceData,
  foreignKeyData,
}: {
  tableSchema: TableSchema;
  columnsSchema: ColumnSchema[];
  singleResourceData: Record<string, unknown> | null;
  foreignKeyData: Record<string, unknown>;
}) {
  const permissions = await loadResourcePermissions(
    tableSchema.schema as never,
    tableSchema.name as never,
  );

  if (singleResourceData === null) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DatabaseIcon />
              </EmptyMedia>
              <EmptyTitle>No Data Available</EmptyTitle>
              <EmptyDescription>
                The {formatTitle(tableSchema.name as string)} resource data does
                not exist.
              </EmptyDescription>
            </EmptyHeader>
            {permissions.canInsert && (
              <EmptyContent>
                <ResourceSheet
                  create
                  showTrigger
                  data={foreignKeyData}
                  tableSchema={tableSchema}
                  columnsSchema={columnsSchema}
                />
              </EmptyContent>
            )}
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const detailColumns =
    columnsSchema?.filter((column) => {
      return !METADATA_COLUMNS.includes(column.name as string);
    }) ?? [];

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
          {permissions.canUpdate && (
            <ResourceSheet
              tableSchema={tableSchema}
              columnsSchema={columnsSchema}
              data={{ ...singleResourceData, ...foreignKeyData }}
              create={false}
            >
              <SheetTrigger>
                <Edit2 className="size-4" />
              </SheetTrigger>
            </ResourceSheet>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {detailColumns.map((column, index) => {
          const value =
            singleResourceData?.[
              column.name as keyof typeof singleResourceData
            ];

          const columnMetadata = getColumnMetadata(tableSchema, column);

          return (
            <div key={column.id}>
              <div className="flex items-start gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Label className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {columnMetadata.icon} {formatTitle(column.name as string)}
                  </Label>
                  <div className="text-muted-foreground text-sm">
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
          );
        })}
      </CardContent>
    </Card>
  );
}

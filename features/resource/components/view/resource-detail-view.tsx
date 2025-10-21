"use client";

import Link from "next/link";

import { PencilIcon } from "lucide-react";

import { Editor } from "@/components/blocks/editor-md/editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { METADATA_COLUMNS } from "@/config/database.config";
import { ColumnSchema } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

import { getColumnMetadata } from "../../lib/columns";
import { AllCells } from "../cells/all-cells";
import { getDataTypeIcon } from "../icons";
import { useResourceContext } from "../resource-context";

export function ResourceDetailView({
  columnsSchema,
  singleResourceData,
  editUrl,
}: {
  columnsSchema: ColumnSchema[];
  singleResourceData: Record<string, unknown>;
  editUrl?: string;
}) {
  const { permissions } = useResourceContext();

  // Separate columns into different categories
  const detailColumns =
    columnsSchema?.filter((column) => {
      return !METADATA_COLUMNS.includes(column.name as string);
    }) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle>Details</CardTitle>
            <CardDescription>
              View resource details and properties
            </CardDescription>
          </div>
          {editUrl && permissions.canUpdate && (
            <Button asChild size="sm">
              <Link href={editUrl}>
                <PencilIcon className="mr-2 size-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {detailColumns.map((column, index) => {
          const value =
            singleResourceData?.[
              column.name as keyof typeof singleResourceData
            ];

          const icon = getDataTypeIcon(column);
          const columnMetadata = getColumnMetadata(column);

          return (
            <div key={column.id}>
              <div className="flex items-start gap-4 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Label className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {icon} {formatTitle(column.name as string)}
                  </Label>
                  <div className="text-muted-foreground text-sm">
                    {columnMetadata.type === "rich_text" ? (
                      <Editor
                        name={columnMetadata.label}
                        value={value as string}
                        disabled
                      />
                    ) : (
                      <AllCells columnMetadata={columnMetadata} value={value} />
                    )}
                  </div>
                </div>
              </div>
              {index < detailColumns.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

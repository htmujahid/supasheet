import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColumnSchema } from "@/lib/database-meta.types";

import { getColumnMetadata } from "../../lib/columns";
import { AllCells } from "../cells/all-cells";
import { getDataTypeIcon } from "../icons";

export function ResourceMetadataView({
  columnsSchema,
  singleResourceData,
}: {
  columnsSchema: ColumnSchema[];
  singleResourceData: Record<string, unknown>;
}) {
  const metadataColumns =
    columnsSchema?.filter((column) =>
      ["created_at", "updated_at"].includes(column.name as string),
    ) ?? [];

  if (!metadataColumns.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
        <CardDescription>
          Timestamps and other metadata information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        {metadataColumns.map((column, index) => {
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
                    {column.name as string} {icon}
                  </Label>
                  <div className="text-muted-foreground text-sm">
                    <AllCells columnMetadata={columnMetadata} value={value} />
                  </div>
                </div>
              </div>
              {index < metadataColumns.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

import Link from "next/link";

import { ExternalLinkIcon, LinkIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Relationship, TableSchema } from "@/lib/database-meta.types";

export function ResourceForiegnDataView({
  tableSchema,
  singleResourceData,
}: {
  tableSchema: TableSchema;
  singleResourceData: Record<string, unknown>;
}) {
  const relationships = (tableSchema?.relationships as Relationship[]) ?? [];

  if (relationships.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Data</CardTitle>
        <CardDescription>
          Related resources through foreign key relationships
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        {relationships.map((relationship, index) => {
          let value =
            singleResourceData?.[
              relationship.source_column_name as keyof typeof singleResourceData
            ];
          const isValue = !!value;
          let link = `/home/resource/${relationship.target_table_schema}/${relationship.target_table_name}?filters=[{"id":"${relationship.target_column_name}","value":"${value}","variant":"text","operator":"eq","filterId":"${relationship.id}"}]`;

          if (!value) {
            value =
              singleResourceData?.[
                relationship.target_column_name as keyof typeof singleResourceData
              ];
            link = `/home/resource/${relationship.source_schema}/${relationship.source_table_name}?filters=[{"id":"${relationship.source_column_name}","value":"${value}","variant":"text","operator":"eq","filterId":"${relationship.id}"}]`;
          }
          return (
            <div key={relationship.id}>
              <div className="flex items-start gap-4 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Label className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {isValue
                      ? relationship.target_table_name
                      : relationship.source_table_name}{" "}
                    <LinkIcon className="size-4 text-muted-foreground shrink-0" />
                  </Label>
                  <Link
                    href={link}
                    className="text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
                  >
                    <ExternalLinkIcon className="size-3.5" />
                    {String(value ?? "N/A")}
                  </Link>
                </div>
              </div>
              {index < relationships.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

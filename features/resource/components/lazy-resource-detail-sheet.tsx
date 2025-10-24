"use client";

import { Loader } from "lucide-react";

import { Editor } from "@/components/blocks/editor-md/editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { METADATA_COLUMNS } from "@/config/database.config";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DatabaseSchemas,
  DatabaseTables,
  ResourceDataSchema,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

import { getColumnMetadata } from "../lib/columns";
import {
  useColumnsSchema,
  useSingleResourceData,
  useTableSchema,
} from "../lib/data";
import { AllCells } from "./cells/all-cells";
import { getDataTypeIcon } from "./icons";

interface LazyResourceDetailSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  schema: DatabaseSchemas;
  resource: DatabaseTables<DatabaseSchemas>;
  resourcePk: Record<string, unknown> | null;
}

export function LazyResourceDetailSheet({
  schema,
  resource,
  resourcePk,
  ...props
}: LazyResourceDetailSheetProps) {
  const isMobile = useIsMobile();

  // Fetch table schema
  const { data: tableSchema, isLoading: isLoadingTableSchema } =
    useTableSchema(schema, resource);

  // Fetch columns schema
  const { data: columnsSchema, isLoading: isLoadingColumnsSchema } =
    useColumnsSchema(schema, resource);

  // Fetch single resource data
  const { data, isLoading: isLoadingData } = useSingleResourceData(
    schema,
    resource,
    resourcePk ?? {},
  );

  const isLoading =
    isLoadingTableSchema || isLoadingColumnsSchema || isLoadingData;

  // Filter out metadata columns
  const detailColumns =
    columnsSchema?.filter((column) => {
      return !METADATA_COLUMNS.includes(column.name as string);
    }) ?? [];

  return (
    <Sheet {...props}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-full w-full flex-col gap-6 overflow-hidden md:max-w-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Resource Details</SheetTitle>
          <SheetDescription>
            View detailed information about this resource
          </SheetDescription>
        </SheetHeader>

        {isLoading || !data ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 space-y-0 overflow-y-auto px-4">
            {detailColumns.map((column, index) => {
              const value = data?.[column.name as keyof ResourceDataSchema];

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
                          <AllCells
                            columnMetadata={columnMetadata}
                            value={value}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {index < detailColumns.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}

        <SheetFooter className="bg-background px-4">
          <SheetClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

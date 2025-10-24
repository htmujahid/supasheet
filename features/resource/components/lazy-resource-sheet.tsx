"use client";

import { useEffect, useState, useTransition } from "react";

import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

import { updateResourceDataAction } from "../lib/actions";
import { READONLY_COLUMNS } from "../lib/constants";
import {
  useColumnsSchema,
  useSingleResourceData,
  useTableSchema,
} from "../lib/data";
import { getJsonColumns, parseJsonColumns, serializeData } from "../lib/utils";
import { ResourceFormField } from "./fields/resource-form-field";

interface LazyResourceSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  schema: DatabaseSchemas;
  resource: DatabaseTables<DatabaseSchemas>;
  resourcePk: Record<string, unknown> | null;
}

export function LazyResourceSheet({
  schema,
  resource,
  resourcePk,
  ...props
}: LazyResourceSheetProps) {
  const isMobile = useIsMobile();
  const [isFormReady, setIsFormReady] = useState(false);

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

  const primaryKeys = ((tableSchema?.primary_keys as PrimaryKey[]) ?? [])?.map(
    (key) => key.name,
  );

  const form = useForm<ResourceDataSchema>({
    defaultValues: {},
  });

  const [isPending, startTransition] = useTransition();

  // Update form when data changes
  useEffect(() => {
    if (data && columnsSchema) {
      const serializedData = serializeData(data, columnsSchema);
      if (serializedData) {
        form.reset(serializedData);
        // Small delay to ensure form fields are fully initialized
        setTimeout(() => setIsFormReady(true), 0);
      }
    } else {
      setIsFormReady(false);
    }
  }, [data, columnsSchema, form]);

  function onUpdate(input: ResourceDataSchema) {
    if (!tableSchema) {
      toast.error("Table schema not found");
      return;
    }

    startTransition(async () => {
      if (!data) return;

      const jsonInput = parseJsonColumns(
        input,
        getJsonColumns(columnsSchema ?? []),
      );

      const primaryKeys = tableSchema.primary_keys as PrimaryKey[];

      const resourceIds = primaryKeys.reduce(
        (acc, key) => {
          acc[key.name] = data[key.name];
          delete input[key.name];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const { data: updatedData, error } = await updateResourceDataAction({
        schema,
        resourceName: resource,
        resourceIds,
        data: { ...input, ...jsonInput },
      });

      if (
        (!updatedData?.length && !error) ||
        error?.message.includes("row-level security policy")
      ) {
        toast.error("You don't have permission to update this resource");
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }

      form.reset(input);

      props.onOpenChange?.(false);
      toast.success("Resource updated successfully");
    });
  }

  const isLoading =
    isLoadingTableSchema || isLoadingColumnsSchema || isLoadingData;

  return (
    <Sheet {...props}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-full w-full flex-col gap-6 overflow-hidden md:max-w-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Update {resource}</SheetTitle>
          <SheetDescription>
            Update the {resource} and save the changes
          </SheetDescription>
        </SheetHeader>

        {isLoading || !isFormReady  ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onUpdate)}
              className="flex flex-col gap-4 overflow-y-auto px-4"
            >
              {columnsSchema
                ?.filter(
                  (column) =>
                    !READONLY_COLUMNS.includes(column.name as string) &&
                    !primaryKeys.includes(column.name as string),
                )
                .map((column) => (
                  <ResourceFormField
                    key={column.id}
                    columnSchema={column}
                    tableSchema={tableSchema ?? null}
                    form={form}
                  />
                ))}
              <SheetFooter className="bg-background sticky bottom-0 flex-row gap-2 px-0 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </SheetClose>
                <Button disabled={isPending} className="flex-1">
                  {isPending && (
                    <Loader
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Update
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}

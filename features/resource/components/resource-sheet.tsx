"use client";

import { useTransition } from "react";

import { useParams } from "next/navigation";

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
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import {
  createResourceDataAction,
  updateResourceDataAction,
} from "../lib/actions";
import { READONLY_COLUMNS } from "../lib/constants";
import { getJsonColumns, parseJsonColumns, serializeData } from "../lib/utils";
import { ResourceFormField } from "./fields/resource-form-field";

interface ResourceSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[];
  data: ResourceDataSchema | null;
  create: boolean;
}

export function ResourceSheet({
  tableSchema,
  columnsSchema,
  data,
  create,
  ...props
}: ResourceSheetProps) {
  const { schema } = useParams<{ schema: DatabaseSchemas }>();
  const { resource } = useParams<{ resource: DatabaseTables<typeof schema> }>();

  const isMobile = useIsMobile();

  const primaryKeys = ((tableSchema?.primary_keys as PrimaryKey[]) ?? [])?.map(
    (key) => key.name,
  );

  const form = useForm<ResourceDataSchema>({
    defaultValues:
      serializeData(data, columnsSchema) ??
      columnsSchema.reduce((acc, column) => {
        acc[column.name as keyof ResourceDataSchema] = "";
        return acc;
      }, {} as ResourceDataSchema),
  });

  const [isPending, startTransition] = useTransition();

  function onCreate(input: ResourceDataSchema) {
    Object.entries(input).forEach(([key, value]) => {
      if (value === "") {
        delete input[key];
      }
    });

    startTransition(async () => {
      const jsonInput = parseJsonColumns(input, getJsonColumns(columnsSchema));

      const { data, error } = await createResourceDataAction({
        schema,
        resourceName: resource,
        data: { ...input, ...jsonInput },
      });

      if (
        (!data?.length && !error) ||
        error?.message.includes("row-level security policy")
      ) {
        toast.error("You don't have permission to create this resource");
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }

      form.reset();

      props.onOpenChange?.(false);
      toast.success("Task updated");
    });
  }

  function onUpdate(input: ResourceDataSchema) {
    if (!tableSchema) {
      toast.error("Table schema not found");
      return;
    }

    // Object.entries(input).forEach(([key, value]) => {
    //   if (value === "") {
    //     delete input[key];
    //   }
    // });

    startTransition(async () => {
      if (!data) return;

      const jsonInput = parseJsonColumns(input, getJsonColumns(columnsSchema));

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
      toast.success("Task updated");
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-full w-full flex-col gap-6 overflow-hidden md:max-w-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {create ? "Create" : "Update"} {resource}
          </SheetTitle>
          <SheetDescription>
            {create ? "Create a new" : "Update the"} {resource} and save the
            changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(create ? onCreate : onUpdate)}
            className="flex flex-col gap-4 overflow-y-auto px-4"
          >
            {columnsSchema
              .filter(
                (column) =>
                  !READONLY_COLUMNS.includes(column.name as string) &&
                  !primaryKeys.includes(column.name as string),
              )
              .map((column) => (
                <ResourceFormField
                  key={column.id}
                  columnSchema={column}
                  tableSchema={tableSchema}
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
                {create ? "Create" : "Update"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

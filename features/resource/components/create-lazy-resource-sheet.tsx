"use client";

import { useTransition } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Loader, Maximize2, Plus } from "lucide-react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

import { createResourceDataAction } from "../lib/actions";
import { READONLY_COLUMNS } from "../lib/constants";
import { getJsonColumns, parseJsonColumns } from "../lib/utils";
import { ResourceFormField } from "./fields/resource-form-field";
import { useColumnsSchema, useResourcePermissions, useTableSchema } from "../lib/data";

type CreateLazyResourceSheetProps = React.ComponentPropsWithRef<typeof Sheet> & {
  showTrigger?: boolean;
  schema: DatabaseSchemas;
  resource: DatabaseTables<DatabaseSchemas>;
};

export function CreateLazyResourceSheet({
  showTrigger,
  schema,
  resource,
  ...props
}: CreateLazyResourceSheetProps) {
  const { data: tableSchema } = useTableSchema(schema, resource);
  const { data: columnsSchema } = useColumnsSchema(schema, resource);
  const { data: resourcePermissions } = useResourcePermissions(schema, resource);

  const isMobile = useIsMobile();

  const form = useForm<ResourceDataSchema>({
    defaultValues: {},
  });

  const [isPending, startTransition] = useTransition();

  if (
    schema === "supasheet" && resource === "accounts"
  ) {
    return null;
  }

  if (
    !tableSchema || 
    !columnsSchema || 
    !columnsSchema?.length ||
    !resourcePermissions?.canInsert
  ) {
    return null;
  }

  function onCreate(input: ResourceDataSchema) {
    if (!tableSchema || !columnsSchema) return;

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

  return (
    <Sheet {...props}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <Plus />
            Create {formatTitle(tableSchema?.name as string) || "Resource"}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-full w-full flex-col gap-6 overflow-hidden md:max-w-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Link
              href={`/home/${schema}/resource/${resource}/create`}
              title="Create New"
            >
              <Maximize2 className="size-4" />
            </Link>
            Create {resource}
          </SheetTitle>
          <SheetDescription>
            Create a new {resource} and save the
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="flex flex-col gap-4 overflow-y-auto px-4"
          >
            {columnsSchema
              .filter(
                (column) =>
                  !READONLY_COLUMNS.includes(column.name as string)
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
                Create
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

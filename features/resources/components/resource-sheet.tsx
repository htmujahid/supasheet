"use client";

import * as React from "react";

import { useParams } from "next/navigation";

import { Loader } from "lucide-react";
import { FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getColumnInputField } from "@/lib/data-table";
import {
  DatabaseTables,
  PrimaryKey,
  TableSchema,
} from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

import { createResourceDataAction, updateResourceDataAction } from "../lib/actions";

interface ResourceSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  tableSchema: Tables<"_pg_meta_tables"> | null;
  columnsSchema: Tables<"_pg_meta_columns">[];
  data: TableSchema | null;
}

export function ResourceSheet({
  tableSchema,
  columnsSchema,
  data,
  ...props
}: ResourceSheetProps) {
  const params = useParams<{ id: DatabaseTables }>();
  const form = useForm<TableSchema>({
    defaultValues: data ??  columnsSchema.reduce((acc, column) => {
      acc[column.name as keyof TableSchema] = getColumnInputField(column)
        .defaultValue as string;
      return acc;
    }, {} as TableSchema),
  });

  const [isPending, startTransition] = React.useTransition();


  function onCreate(input: TableSchema) {
    startTransition(async () => {
      const { data, error } = await createResourceDataAction({
        resourceName: params.id,
        data: input,
      });

      if (!data?.length) {
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

  function onUpdate(input: TableSchema) {
    if (!tableSchema) {
      toast.error("Table schema not found");
      return;
    }

    startTransition(async () => {
      if (!data) return;

      const primaryKeys = tableSchema.primary_keys as PrimaryKey[];

      const resourceIds = primaryKeys.reduce(
        (acc, key) => {
          acc[key.name] = data[key.name];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const { data: updatedData, error } = await updateResourceDataAction({
        resourceName: params.id,
        resourceIds,
        data: input,
      });

      if (!updatedData?.length) {
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
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>
            {data ? "Update" : "Create"} {params.id}
          </SheetTitle>
          <SheetDescription>
            {data ? "Update the" : "Create a new"} {params.id} and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data ? onUpdate : onCreate)}
            className="flex flex-col gap-4 overflow-y-auto px-4"
          >
            {columnsSchema
              .filter(
                (column) =>
                  !["created_at", "updated_at"].includes(column.name as string),
              )
              .map((column) => {
                const columnInput = getColumnInputField(column);

                return (
                  <FormField
                    key={column.id}
                    control={form.control}
                    disabled={columnInput.disabled}
                    name={column.name as FieldPath<TableSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {column.name as string}{" "}
                          {columnInput.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div>
                            {columnInput.variant === "input" && (
                              <Input
                                value={field.value as string}
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                disabled={columnInput.disabled}
                              />
                            )}
                            {columnInput.variant === "text" && (
                              <Textarea
                                className="resize-none"
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: !column.is_nullable
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                disabled={columnInput.disabled}
                              />
                            )}
                            {columnInput.variant === "select" && (
                              <Select
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                value={field.value as string}
                                onValueChange={(value) => {
                                  form.setValue(
                                    column.name as FieldPath<TableSchema>,
                                    value,
                                  );
                                }}
                                disabled={columnInput.disabled}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(column.enums as string[])?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {columnInput.variant === "number" && (
                              <Input
                                type="number"
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                value={field.value as string}
                                disabled={columnInput.disabled}
                              />
                            )}
                            {columnInput.variant === "boolean" && (
                              <Select
                                onValueChange={(value) => {
                                  form.setValue(
                                    column.name as FieldPath<TableSchema>,
                                    value === "true",
                                  );
                                }}
                                value={field.value ? "true" : "false"}
                                disabled={columnInput.disabled}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {columnInput.variant === "date" && (
                              <Input
                                type="date"
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                value={field.value as string}
                                disabled={columnInput.disabled}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            )}
                            {columnInput.variant === "time" && (
                              <Input
                                type="time"
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                value={field.value as string}
                                disabled={columnInput.disabled}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            )}
                            {columnInput.variant === "datetime" && (
                              <Input
                                type="datetime-local"
                                {...form.register(
                                  column.name as FieldPath<TableSchema>,
                                  {
                                    required: columnInput.required
                                      ? `${column.name} is required`
                                      : false,
                                  },
                                )}
                                value={field.value as string}
                                disabled={columnInput.disabled}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            <SheetFooter className="flex-row gap-2 px-0 pt-2 sm:space-x-0 sticky bottom-0 bg-background">
              <Button disabled={isPending} className="flex-1">
                {isPending && (
                  <Loader
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {data ? "Update" : "Create"}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

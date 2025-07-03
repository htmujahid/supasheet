"use client";

import { useTransition } from "react";

import { useParams } from "next/navigation";

import { Loader } from "lucide-react";
import { FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DatabaseTables,
  PrimaryKey,
  Relationship,
  TableSchema,
} from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

import {
  createResourceDataAction,
  updateResourceDataAction,
} from "../lib/actions";
import { BooleanField } from "./fields/boolean-field";
import { DateField } from "./fields/date-field";
import { DatetimeField } from "./fields/datetime-field";
import { ForeignKeyField } from "./fields/foreign-key-field";
import { JsonField } from "./fields/json-field";
import { NumberField } from "./fields/number-field";
import { SelectField } from "./fields/select-field";
import { TextField } from "./fields/text-field";
import { TimeField } from "./fields/time-field";
import { FieldProps } from "./fields/types";
import { getColumnInputField } from "./fields/utils";
import { UuidField } from "./fields/uuid-field";

const JSON_DATA_TYPES = ["jsonb", "json"] as const;

function getJsonColumns(
  columnsSchema: Tables<"_pg_meta_columns">[],
): Tables<"_pg_meta_columns">[] {
  return columnsSchema.filter((column) =>
    JSON_DATA_TYPES.includes(
      column.data_type as (typeof JSON_DATA_TYPES)[number],
    ),
  );
}

function serializeJsonColumns(
  input: TableSchema | null,
  columnsSchema: Tables<"_pg_meta_columns">[],
): TableSchema | null {
  if (!input) return input;

  const jsonColumns = getJsonColumns(columnsSchema);

  const serialized = jsonColumns.reduce((acc, column) => {
    acc[column.name as keyof TableSchema] = JSON.stringify(
      input[column.name as keyof TableSchema],
    );
    return acc;
  }, {} as TableSchema);

  return { ...input, ...serialized };
}

function parseJsonColumns(
  input: TableSchema,
  jsonColumns: Tables<"_pg_meta_columns">[],
): TableSchema {
  return jsonColumns.reduce((acc, column) => {
    try {
      acc[column.name as keyof TableSchema] = JSON.parse(
        input[column.name as keyof TableSchema] as string,
      );
    } catch {
      acc[column.name as keyof TableSchema] =
        input[column.name as keyof TableSchema];
    }
    return acc;
  }, {} as TableSchema);
}

interface ResourceSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
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
    defaultValues:
      serializeJsonColumns(data, columnsSchema) ?? {}
  });

  const [isPending, startTransition] = useTransition();

  function onCreate(input: TableSchema) {
    startTransition(async () => {
      const jsonInput = parseJsonColumns(input, getJsonColumns(columnsSchema));

      const { data, error } = await createResourceDataAction({
        resourceName: params.id,
        data: { ...input, ...jsonInput },
      });

      if (!data?.length && !error) {
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

      const jsonInput = parseJsonColumns(input, getJsonColumns(columnsSchema));

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
        data: { ...input, ...jsonInput },
      });

      if (!updatedData?.length && !error) {
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
            {data ? "Update the" : "Create a new"} {params.id} and save the
            changes
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

                const relationship = (
                  tableSchema?.relationships as Relationship[]
                )?.find(
                  (relationship) =>
                    relationship.source_column_name === column.name,
                );

                return (
                  <FormField
                    key={column.id}
                    control={form.control}
                    disabled={columnInput.disabled}
                    name={column.name as FieldPath<TableSchema>}
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          {column.name as string}{" "}
                          {columnInput.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div>
                            {relationship ? (
                              <ForeignKeyField
                                form={form}
                                columnInput={columnInput}
                                column={column}
                                relationship={relationship}
                              />
                            ) : (
                              <AllFields
                                form={form}
                                columnInput={columnInput}
                                column={column}
                              />
                            )}
                          </div>
                        </FormControl>
                        <If condition={columnInput.defaultValue}>
                          {(defaultValue) => (
                            <FormDescription>
                              DEFAULT: {defaultValue}
                            </FormDescription>
                          )}
                        </If>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            <SheetFooter className="bg-background sticky bottom-0 flex-row gap-2 px-0 pt-2 sm:space-x-0">
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

function AllFields(props: FieldProps) {
  if (props.columnInput.variant === "uuid") {
    return (
      <UuidField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "text") {
    return (
      <TextField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "number") {
    return (
      <NumberField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "boolean") {
    return (
      <BooleanField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "select") {
    return (
      <SelectField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "date") {
    return (
      <DateField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "time") {
    return (
      <TimeField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "datetime") {
    return (
      <DatetimeField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
  if (props.columnInput.variant === "json") {
    return (
      <JsonField
        form={props.form}
        columnInput={props.columnInput}
        column={props.column}
      />
    );
  }
}

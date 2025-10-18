"use client";

import { useTransition } from "react";

import { useParams, useRouter } from "next/navigation";

import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { createResourceDataAction } from "../lib/actions";
import { READONLY_COLUMNS } from "../lib/constants";
import { getJsonColumns, parseJsonColumns } from "../lib/utils";
import { ResourceFormField } from "./fields/resource-form-field";

interface ResourceCreateFormProps {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[];
}

export function ResourceCreateForm({
  tableSchema,
  columnsSchema,
}: ResourceCreateFormProps) {
  const { schema } = useParams<{ schema: DatabaseSchemas }>();
  const { resource } = useParams<{ resource: DatabaseTables<typeof schema> }>();
  const router = useRouter();

  const primaryKeys = ((tableSchema?.primary_keys as PrimaryKey[]) ?? [])?.map(
    (key) => key.name,
  );

  const form = useForm<ResourceDataSchema>({
    defaultValues: columnsSchema.reduce((acc, column) => {
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
      toast.success("Resource created successfully");

      // Navigate to the detail page of the newly created resource
      if (data && data.length > 0) {
        const createdResource = data[0];
        const pkValues = primaryKeys
          .map((pkName) => createdResource[pkName])
          .join("/");
        router.push(`/home/resource/${schema}/${resource}/${pkValues}`);
      } else {
        // If no primary keys or data, navigate to the list page
        router.push(`/home/resource/${schema}/${resource}`);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create {resource}</CardTitle>
        <CardDescription>
          Create a new resource and save changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreate)} className="space-y-6">
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending && (
                  <Loader
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Create Resource
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

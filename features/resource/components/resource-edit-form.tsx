"use client";

import { useState, useTransition } from "react";

import { useParams, useRouter } from "next/navigation";

import { Loader, Trash2 } from "lucide-react";
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

import { updateResourceDataAction } from "../lib/actions";
import { READONLY_COLUMNS } from "../lib/constants";
import { getJsonColumns, parseJsonColumns, serializeData } from "../lib/utils";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceFormField } from "./fields/resource-form-field";
import { useResourceContext } from "./resource-context";

interface ResourceEditFormProps {
  tableSchema: TableSchema | null;
  columnsSchema: ColumnSchema[];
  data: ResourceDataSchema;
}

export function ResourceEditForm({
  tableSchema,
  columnsSchema,
  data,
}: ResourceEditFormProps) {
  const { permissions } = useResourceContext();
  const { schema } = useParams<{ schema: DatabaseSchemas }>();
  const { id } = useParams<{ id: DatabaseTables<typeof schema> }>();
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const primaryKeys = ((tableSchema?.primary_keys as PrimaryKey[]) ?? [])?.map(
    (key) => key.name,
  );

  const form = useForm<ResourceDataSchema>({
    defaultValues: serializeData(data, columnsSchema) ?? {},
  });

  const [isPending, startTransition] = useTransition();

  function onUpdate(input: ResourceDataSchema) {
    if (!tableSchema) {
      toast.error("Table schema not found");
      return;
    }

    Object.entries(input).forEach(([key, value]) => {
      if (value === "") {
        delete input[key];
      }
    });

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
        resourceName: id,
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
      toast.success("Resource updated successfully");

      // Navigate back to view page
      const pkValues = primaryKeys.map((pk) => data[pk.name]).join("/");
      router.push(`/home/resource/${schema}/${id}/${pkValues}`);
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>Edit {id}</CardTitle>
              <CardDescription>
                Update the resource and save changes
              </CardDescription>
            </div>
            {permissions.canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isPending}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-6">
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
                  type="submit"
                  disabled={isPending || !permissions.canUpdate}
                  className="flex-1"
                >
                  {isPending && (
                    <Loader
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {permissions.canDelete && (
        <DeleteResourceDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          resources={[data]}
          tableSchema={tableSchema}
          columnSchema={columnsSchema}
          showTrigger={false}
          onSuccess={() => router.push(`/home/resource/${schema}/${id}`)}
        />
      )}
    </>
  );
}

"use client";

import * as React from "react";

import { Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { deleteResourceDataAction } from "@/features/resource/lib/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
} from "@/lib/database-meta.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

import { useColumnsSchema, useTableSchema } from "../lib/data";

interface LazyDeleteResourceDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  schema: DatabaseSchemas;
  resource: DatabaseTables<DatabaseSchemas>;
  resourcePk: Record<string, unknown> | null;
  onSuccess?: () => void;
}

export function LazyDeleteResourceDialog({
  schema,
  resource,
  resourcePk,
  onSuccess,
  ...props
}: LazyDeleteResourceDialogProps) {
  const supabase = useSupabase();

  // Fetch table schema
  const { data: tableSchema, isLoading: isLoadingTableSchema } = useTableSchema(
    schema,
    resource,
  );

  // Fetch columns schema
  const { data: columnsSchema, isLoading: isLoadingColumnsSchema } =
    useColumnsSchema(schema, resource);

  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const isLoading = isLoadingTableSchema || isLoadingColumnsSchema;

  function onDelete() {
    if (!tableSchema || !resourcePk) {
      toast.error("Table schema not found");
      return;
    }

    const primaryKeys = tableSchema.primary_keys as PrimaryKey[];

    const resourceIds = primaryKeys.reduce(
      (acc, key) => {
        acc[key.name] = [resourcePk[key.name]];
        return acc;
      },
      {} as Record<string, unknown[]>,
    );

    startDeleteTransition(async () => {
      const { data, error } = await deleteResourceDataAction({
        schema,
        resourceName: resource,
        resourceIds,
      });

      if (
        (!data?.length && !error) ||
        error?.message.includes("row-level security policy")
      ) {
        toast.error("You don't have permission to delete this resource");
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }

      // Handle file deletion if needed
      const fileNames = columnsSchema
        ? data?.flatMap((r) =>
            columnsSchema
              .flatMap((c) => {
                if (c.format !== "file") return null;
                const fileUrls = r[c.name as string] as string[] | null;
                if (!fileUrls?.length) return null;
                return fileUrls?.map((url) => {
                  const parts = url.split("/");
                  if (parts.length < 2) return null;
                  return c.name + "/" + parts[parts.length - 1];
                });
              })
              .filter(Boolean),
          )
        : [];

      if (fileNames && fileNames.length > 0) {
        await supabase.storage
          .from("uploads")
          .remove(fileNames.map((name) => `${schema}/${resource}/${name}`));
      }

      props.onOpenChange?.(false);
      toast.success("Resource deleted");
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              resource from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete resource"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending || isLoading}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete this
            resource from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete resource"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending || isLoading}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

import { useTransition } from "react";

import { useParams } from "next/navigation";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { deleteResourceDataAction } from "@/features/resource/lib/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { useSupabase } from "@/lib/supabase/hooks/use-supabase";

type DeleteResourceDialogProps = React.ComponentPropsWithoutRef<
  typeof Dialog
> & {
  resources: Row<ResourceDataSchema>["original"][];
  tableSchema: TableSchema | null;
  columnSchema: ColumnSchema[];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

export function DeleteResourceDialog({
  resources,
  tableSchema,
  columnSchema,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteResourceDialogProps) {
  const supabase = useSupabase();
  const { schema } = useParams<{ schema: DatabaseSchemas }>();

  const { resource } = useParams<{ resource: DatabaseTables<typeof schema> }>();

  const [isDeletePending, startDeleteTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    if (!tableSchema) {
      toast.error("Table schema not found");
      return;
    }

    const primaryKeys = tableSchema.primary_keys as PrimaryKey[];

    const resourceIds = primaryKeys.reduce(
      (acc, key) => {
        acc[key.name] = resources.map((d) => d[key.name]);
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

      const fileNames = columnSchema
        ? resources.flatMap((r) =>
            columnSchema
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

      if (fileNames.length > 0) {
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
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button
              variant={!showTrigger ? "outline" : "destructive"}
              size="sm"
            >
              <Trash className="size-4" aria-hidden="true" />
              Delete {resources.length > 1 && `(${resources.length})`}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{resources.length}</span>
              {resources.length === 1 ? " task" : " tasks"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
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
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({resources.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{resources.length}</span>
            {resources.length === 1 ? " task" : " tasks"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
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

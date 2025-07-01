"use client";

import * as React from "react";

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
import { deleteResourceDataAction } from "@/features/resources/lib/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DatabaseTables,
  PrimaryKey,
  TableSchema,
} from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

interface DeleteResourceDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  resources: Row<TableSchema>["original"][];
  tableSchema: Tables<"_pg_meta_tables"> | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteResourceDialog({
  resources,
  tableSchema,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteResourceDialogProps) {
  const params = useParams<{ id: DatabaseTables }>();
  const [isDeletePending, startDeleteTransition] = React.useTransition();
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
        resourceName: params.id,
        resourceIds,
      });

      if (!data?.length) {
        toast.error("You don't have permission to delete this resource");
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }

      props.onOpenChange?.(false);
      toast.success("Resources deleted");
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({resources.length})
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

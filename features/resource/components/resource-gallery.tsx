"use client";

import { useState } from "react";

import { Copy, Eye, Image as ImageIcon, Pencil, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ColumnSchema, ResourceDataSchema, TableSchema } from "@/lib/database-meta.types";

import { GalleryViewData } from "../lib/types";
import { If } from "@/components/makerkit/if";
import { DataTableRowAction } from "@/interfaces/data-table/types/data-table";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { ResourceSheet } from "./resource-sheet";
import { ResourceDetailSheet } from "./resource-detail-sheet";
import { Row } from "@tanstack/react-table";
import { useResourceContext } from "./resource-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ResourceGalleryView({
  data,
  tableSchema,
  columnsSchema,
}: {
  data: GalleryViewData[];
  tableSchema: TableSchema;
  columnsSchema: ColumnSchema[];
}) {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<ResourceDataSchema> | null>(null);

  const { permissions } = useResourceContext();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button
          variant="outline"
          >
          Filter
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item, index) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger asChild>
              <Card>
                <CardHeader>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                    {item.cover && item.cover.length > 0 && item.cover[0] ? (
                      <img
                        src={item.cover}
                        alt={item.title || "Gallery item"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      item.cover && item.cover.length > 0 && item.cover[0] && "hidden"
                    )}>
                      <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                    {item.badge && (
                      <Badge className="absolute right-2 top-2 capitalize">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle>
                    {item.title || "Untitled"}
                  </CardTitle>
                  {item.description && (
                    <CardDescription>
                      {item.description}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(item.data, null, 2)
                  )
                }
              >
                <Copy />
                Copy Data
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() =>
                  setRowAction({
                    variant: "view",
                    row: { original: item.data } as Row<ResourceDataSchema>,
                  })
                }
              >
                <Eye />
                View Details
              </ContextMenuItem>
              <If condition={permissions?.canUpdate}>
                <ContextMenuItem
                  onClick={() =>
                    setRowAction({
                      variant: "update",
                      row: { original: item.data } as Row<ResourceDataSchema>,
                    })
                  }
                >
                  <Pencil />
                  Edit
                </ContextMenuItem>
              </If>
              <If condition={permissions?.canDelete}>
                <ContextMenuSeparator />
                <ContextMenuItem
                  variant="destructive"
                  onClick={() =>
                    setRowAction({
                      variant: "delete",
                      row: { original: item.data } as Row<ResourceDataSchema>,
                    })
                  }
                >
                  <Trash />
                  Delete
                </ContextMenuItem>
              </If>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      <If condition={data.length === 0}>
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No items to display</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no gallery items available at the moment.
          </p>
        </div>
      </If>

      <If condition={rowAction?.variant === "delete" && tableSchema}>
        <DeleteResourceDialog
          open={rowAction?.variant === "delete"}
          onOpenChange={() => setRowAction(null)}
          resources={rowAction?.row.original ? [rowAction?.row.original] : []}
          tableSchema={tableSchema ?? null}
          columnSchema={columnsSchema ?? []}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      </If>
      <If condition={rowAction?.variant === "update" && tableSchema}>
        <ResourceSheet
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={rowAction?.row.original ?? null}
        />
      </If>
      <If condition={rowAction?.variant === "view" && tableSchema}>
        <ResourceDetailSheet
          open={rowAction?.variant === "view"}
          onOpenChange={() => setRowAction(null)}
          tableSchema={tableSchema ?? null}
          columnsSchema={columnsSchema ?? []}
          data={rowAction?.row.original ?? null}
        />
      </If>
    </div>
  );
}
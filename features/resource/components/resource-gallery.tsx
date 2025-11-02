"use client";

import { Eye, Image as ImageIcon, Pencil, Trash } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ColumnSchema } from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

import { getColumnMeta } from "../lib/columns";
import { GalleryViewData } from "../lib/types";
import { useResourceContext } from "./resource-context";
import { ResourceFilterList } from "./resource-filter-list";

export function ResourceGalleryView({
  data,
  columnsSchema,
}: {
  data: GalleryViewData[];
  columnsSchema: ColumnSchema[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <ResourceFilterList
          columns={columnsSchema.map((c) => getColumnMeta(c))}
          shallow={false}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item, index) => (
          <GalleryContextMenu key={index} item={item}>
            <Card>
              <CardHeader>
                <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-md">
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
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      item.cover &&
                        item.cover.length > 0 &&
                        item.cover[0] &&
                        "hidden",
                    )}
                  >
                    <ImageIcon className="text-muted-foreground/40 h-12 w-12" />
                  </div>
                  {item.badge && (
                    <Badge className="absolute top-2 right-2 capitalize">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle>{item.title || "Untitled"}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardContent>
            </Card>
          </GalleryContextMenu>
        ))}
      </div>

      <If condition={data.length === 0}>
        <Empty className="min-h-[400px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No items to display</EmptyTitle>
            <EmptyDescription>
              There are no gallery items available at the moment.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </If>
    </div>
  );
}

function GalleryContextMenu({
  children,
  item,
}: {
  children: React.ReactNode;
  item: GalleryViewData;
}) {
  const { permissions, setResourceAction } = useResourceContext();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() =>
            setResourceAction({
              variant: "view",
              data: item.data,
            })
          }
        >
          <Eye className="size-4" />
          View Details
        </ContextMenuItem>
        <If condition={permissions?.canUpdate}>
          <ContextMenuItem
            onClick={() =>
              setResourceAction({
                variant: "update",
                data: item.data,
              })
            }
          >
            <Pencil className="size-4" />
            Edit Details
          </ContextMenuItem>
        </If>
        <If condition={permissions?.canDelete}>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() =>
              setResourceAction({
                variant: "delete",
                data: item.data,
              })
            }
          >
            <Trash className="size-4" />
            Delete Item
          </ContextMenuItem>
        </If>
      </ContextMenuContent>
    </ContextMenu>
  );
}

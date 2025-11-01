"use client";

import { Copy, Eye, Image as ImageIcon, Pencil, Trash } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

import { GalleryViewData } from "../lib/types";
import { useResourceContext } from "./resource-context";

export function ResourceGalleryView({ data }: { data: GalleryViewData[] }) {
  const { permissions, setResourceAction } = useResourceContext();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button variant="outline">Filter</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item, index) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger asChild>
              <Card
                onClick={() => {
                  setResourceAction({
                    variant: "view",
                    data: item.data,
                  });
                }}
              >
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
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(item.data, null, 2),
                  )
                }
              >
                <Copy />
                Copy Data
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() =>
                  setResourceAction({
                    variant: "view",
                    data: item.data,
                  })
                }
              >
                <Eye />
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
                  <Pencil />
                  Edit
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
          <ImageIcon className="text-muted-foreground/40 h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No items to display</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            There are no gallery items available at the moment.
          </p>
        </div>
      </If>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";

import { Copy, Eye, Pencil, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";

import { updateResourceDataAction } from "../lib/actions";
import { ListViewData, ListViewReducedData } from "../lib/types";
import { LazyResourceSheet } from "./lazy-resource-sheet";
import { LazyResourceDetailSheet } from "./lazy-resource-detail-sheet";
import { LazyDeleteResourceDialog } from "./lazy-delete-resource-dialog";
import { If } from "@/components/makerkit/if";

type ResourceAction = {
  variant: "view" | "update" | "delete";
  resourcePk: Record<string, unknown>;
};

export function ResourceKanbanView({
  data,
  schema,
  resource,
  groupBy,
  layout,
}: {
  data: ListViewReducedData;
  schema: DatabaseSchemas;
  resource: DatabaseTables<typeof schema>;
  groupBy: string;
  layout: "list" | "board";
}) {
  const [columns, setColumns] = useState<ListViewReducedData>(data);
  const [resourceAction, setResourceAction] = useState<ResourceAction | null>(
    null,
  );

  const buildId = useCallback((item: ListViewData) => {
    return Object.values(item).join("/");
  }, []);

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      onUpdate={async function (item, _, to) {
        await updateResourceDataAction({
          schema: schema,
          resourceName: resource,
          resourceIds: item.pk,
          data: { [groupBy]: to },
        });
      }}
      orientation={layout === "list" ? "vertical" : "horizontal"}
      getItemValue={buildId}
    >
      <KanbanBoard className="h-[calc(100vh-80px)] overflow-x-auto">
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <KanbanColumn key={columnValue} value={columnValue} className="min-w-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{columnValue}</span>
                <Badge
                  variant="secondary"
                  className="pointer-events-none rounded-sm"
                >
                  {tasks.length}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-0.5">
              {tasks.map((task) => (
                <ContextMenu key={buildId(task)}>
                  <ContextMenuTrigger asChild>
                    <KanbanItem
                      value={buildId(task)}
                      asHandle
                      asChild
                    >
                      <div className="bg-card rounded-md border p-3 shadow-xs">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="line-clamp-1 text-sm font-medium">
                              {task.title}
                            </span>
                            <Badge className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize">
                              {task.badge}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground flex items-center justify-between text-xs">
                            {task.description && (
                              <div className="flex items-center gap-1">
                                <span className="line-clamp-1">
                                  {task.description}
                                </span>
                              </div>
                            )}
                            {task.date && (
                              <time className="text-[10px] tabular-nums">
                                {task.date}
                              </time>
                            )}
                          </div>
                        </div>
                      </div>
                    </KanbanItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-52">
                    <ContextMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          JSON.stringify(task, null, 2)
                        )
                      }
                    >
                      <Copy className="size-4" />
                      Copy
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() =>
                        setResourceAction({
                          variant: "view",
                          resourcePk: task.pk,
                        })
                      }
                    >
                      <Eye className="size-4" />
                      View Details
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() =>
                        setResourceAction({
                          variant: "update",
                          resourcePk: task.pk,
                        })
                      }
                    >
                      <Pencil className="size-4" />
                      Edit
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() =>
                        setResourceAction({
                          variant: "delete",
                          resourcePk: task.pk,
                        })
                      }
                    >
                      <Trash className="size-4" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        <div className="bg-primary/10 size-full rounded-md" />
      </KanbanOverlay>
      <If condition={resourceAction?.variant === "view"}>
        <LazyResourceDetailSheet
          open={resourceAction?.variant === "view"}
          onOpenChange={(open) => {
            if (!open) setResourceAction(null);
          }}
          schema={schema}
          resource={resource}
          resourcePk={resourceAction?.resourcePk ?? null}
        />
      </If>
      <If condition={resourceAction?.variant === "update"}>
        <LazyResourceSheet
          open={resourceAction?.variant === "update"}
          onOpenChange={(open) => {
            if (!open) setResourceAction(null);
          }}
          schema={schema}
          resource={resource}
          resourcePk={resourceAction?.resourcePk ?? null}
        />
      </If>
      <If condition={resourceAction?.variant === "delete"}>
        <LazyDeleteResourceDialog
          open={resourceAction?.variant === "delete"}
          onOpenChange={(open) => {
            if (!open) setResourceAction(null);
          }}
          schema={schema}
          resource={resource}
          resourcePk={resourceAction?.resourcePk ?? null}
          onSuccess={() => {
            // Optionally refetch or update local state
            setResourceAction(null);
          }}
        />
      </If>
    </Kanban>
  );
}
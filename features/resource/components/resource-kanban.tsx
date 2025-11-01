"use client";

import { useCallback, useState } from "react";

import Link from "next/link";

import {
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
  Copy,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";
import { cn } from "@/lib/utils";

import { updateResourceDataAction } from "../lib/actions";
import { KanbanViewData, KanbanViewReducedData } from "../lib/types";
import { useResourceContext } from "./resource-context";

export function ResourceKanbanView({
  data,
  tableSchema,
  groupBy,
  layout,
}: {
  data: KanbanViewReducedData;
  tableSchema: TableSchema;
  groupBy: string;
  layout: "list" | "board";
}) {
  const schema = tableSchema.schema as DatabaseSchemas;
  const resource = tableSchema.name as DatabaseTables<DatabaseSchemas>;

  const [columns, setColumns] = useState<KanbanViewReducedData>(data);
  const { permissions, setResourceAction } = useResourceContext();

  const buildId = useCallback((item: KanbanViewData) => {
    return Object.values(item).join("/");
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <Button variant={"outline"}>Filter</Button>
        <ButtonGroup>
          <Button
            size="icon-sm"
            variant={layout === "board" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=board"}>
              <AlignStartHorizontalIcon />
            </Link>
          </Button>
          <Button
            size="icon-sm"
            variant={layout === "list" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=list"}>
              <AlignStartVerticalIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </div>
      <Kanban
        value={columns}
        onValueChange={setColumns}
        onUpdate={async function (item, _, to) {
          const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

          const pk = primaryKeys.reduce(
            (pkAcc, pkField) => {
              pkAcc[pkField.name] = item.data[pkField.name];
              return pkAcc;
            },
            {} as Record<string, unknown>,
          );

          await updateResourceDataAction({
            schema,
            resourceName: resource,
            resourceIds: pk,
            data: { [groupBy]: to },
          });
        }}
        orientation={layout === "list" ? "vertical" : "horizontal"}
        getItemValue={buildId}
      >
        <KanbanBoard
          className={cn("overflow-x-auto", {
            "h-[calc(100vh-114px)]": layout === "board",
          })}
        >
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <KanbanColumn
              key={columnValue}
              value={columnValue}
              className="min-w-xs"
            >
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
              <div className="flex flex-col gap-2 overflow-y-auto p-0.5">
                {tasks.map((task) => (
                  <ContextMenu key={buildId(task)}>
                    <ContextMenuTrigger asChild>
                      <KanbanItem value={buildId(task)} asHandle asChild>
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
                            JSON.stringify(task, null, 2),
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
                            data: task.data,
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
                              data: task.data,
                            })
                          }
                        >
                          <Pencil className="size-4" />
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
                              data: task.data,
                            })
                          }
                        >
                          <Trash className="size-4" />
                          Delete
                        </ContextMenuItem>
                      </If>
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
      </Kanban>
    </div>
  );
}

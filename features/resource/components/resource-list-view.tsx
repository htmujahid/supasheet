"use client";

import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";

import { updateResourceDataAction } from "../lib/actions";
import { BoardViewData, BoardViewReducedData } from "../lib/types";

export function ResourceListView({
  data,
  schema,
  resource,
  groupBy,
}: {
  data: BoardViewReducedData;
  schema: DatabaseSchemas;
  resource: DatabaseTables<typeof schema>;
  groupBy: string;
}) {
  const [columns, setColumns] = useState<BoardViewReducedData>(data);

  const buildId = useCallback((item: BoardViewData) => {
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
      orientation="vertical"
      getItemValue={buildId}
    >
      <KanbanBoard className="">
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
                <KanbanItem
                  key={buildId(task)}
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
                    </div>
                  </div>
                </KanbanItem>
              ))}
            </div>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        <div className="bg-primary/10 size-full rounded-md" />
      </KanbanOverlay>
    </Kanban>
  );
}

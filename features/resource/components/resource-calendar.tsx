"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CalendarRange, Columns, Grid2x2, Grid3x3, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  EventCalendarAgendaView,
  EventCalendarContainer,
  EventCalendarDayView,
  EventCalendarHeader,
  EventCalendarMonthView,
  EventCalendarRoot,
  EventCalendarWeekView,
  EventCalendarYearView,
  IEvent,
} from "@/components/ui/event-calendar";
import {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  TableMetadata,
  TableSchema,
} from "@/lib/database-meta.types";

import { updateResourceDataAction } from "../lib/actions";
import { getColumnFilterData } from "../lib/columns";
import { useResourceContext } from "./resource-context";
import { ResourceFilterList } from "./resource-filter-list";

export function ResourceCalendarView({
  view,
  data,
  tableSchema,
  columnsSchema,
  currentView,
}: {
  view: "day" | "week" | "month" | "year" | "agenda";
  data: IEvent[];
  tableSchema: TableSchema;
  columnsSchema: ColumnSchema[];
  currentView: Required<TableMetadata>["items"][number];
}) {
  const schema = tableSchema.schema as DatabaseSchemas;
  const resource = tableSchema.name as DatabaseTables<DatabaseSchemas>;

  const router = useRouter();
  const { setResourceAction, permissions } = useResourceContext();

  function onAddEvent(event: {
    startDate: Date;
    hour: number;
    minute: number;
  }) {
    const startDateFieldName = currentView.startDate as string;
    const endDateFieldName = currentView.endDate as string;

    const startDate = new Date(event.startDate);
    startDate.setHours(event.hour, event.minute);

    const endDate = new Date(event.startDate);
    endDate.setHours(event.hour, event.minute + 30);

    setResourceAction({
      variant: "create",
      data: {
        [startDateFieldName]: startDate.toISOString(),
        [endDateFieldName]: endDate.toISOString(),
      },
    });
  }

  async function onDragEvent(event: IEvent) {
    const startDateFieldName = currentView.startDate as string;
    const endDateFieldName = currentView.endDate as string;

    const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

    const pk = primaryKeys.reduce(
      (pkAcc, pkField) => {
        pkAcc[pkField.name] = event.data?.[pkField.name];
        return pkAcc;
      },
      {} as Record<string, unknown>,
    );

    await updateResourceDataAction({
      schema,
      resourceName: resource,
      resourceIds: pk,
      data: {
        [startDateFieldName]: event.startDate,
        [endDateFieldName]: event.endDate,
      },
    });
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <ResourceFilterList
          columns={columnsSchema.map((c) => getColumnFilterData(c))}
          shallow={false}
        />
        <EventCalendarNavigation view={view} />
      </div>
      <EventCalendarRoot
        view={view}
        events={data}
        onViewUpdate={(view) => {
          router.push(`?view=${view}`);
        }}
        onAddEvent={onAddEvent}
        onDragEvent={onDragEvent}
        onEventView={
          permissions.canSelect
            ? (event) => {
                setResourceAction({ variant: "view", data: event.data });
              }
            : undefined
        }
        onEventUpdate={
          permissions.canUpdate
            ? (event) => {
                setResourceAction({ variant: "update", data: event.data });
              }
            : undefined
        }
        onEventDelete={
          permissions.canDelete
            ? (event) => {
                setResourceAction({ variant: "delete", data: event.data });
              }
            : undefined
        }
      >
        <EventCalendarHeader />
        <EventCalendarContainer>
          <EventCalendarDayView />
          <EventCalendarWeekView />
          <EventCalendarMonthView />
          <EventCalendarYearView />
          <EventCalendarAgendaView />
        </EventCalendarContainer>
      </EventCalendarRoot>
    </div>
  );
}

function EventCalendarNavigation({
  view,
}: {
  view: "day" | "week" | "month" | "year" | "agenda";
}) {
  return (
    <ButtonGroup>
      <Button
        asChild
        aria-label="View by day"
        size="icon-sm"
        variant={view === "day" ? "default" : "outline"}
      >
        <Link href="?view=day">
          <List className="size-4" />
        </Link>
      </Button>

      <Button
        asChild
        aria-label="View by week"
        size="icon-sm"
        variant={view === "week" ? "default" : "outline"}
      >
        <Link href="?view=week">
          <Columns className="size-4" />
        </Link>
      </Button>

      <Button
        asChild
        aria-label="View by month"
        size="icon-sm"
        variant={view === "month" ? "default" : "outline"}
      >
        <Link href="?view=month">
          <Grid2x2 className="size-4" />
        </Link>
      </Button>

      <Button
        asChild
        aria-label="View by year"
        size="icon-sm"
        variant={view === "year" ? "default" : "outline"}
      >
        <Link href="?view=year">
          <Grid3x3 className="size-4" />
        </Link>
      </Button>

      <Button
        asChild
        aria-label="View by agenda"
        size="icon-sm"
        variant={view === "agenda" ? "default" : "outline"}
      >
        <Link href="?view=agenda">
          <CalendarRange className="size-4" />
        </Link>
      </Button>
    </ButtonGroup>
  );
}

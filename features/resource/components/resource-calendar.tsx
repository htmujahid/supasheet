"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarRange, Columns, Grid2x2, Grid3x3, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { EventCalendarAgendaView, EventCalendarContainer, EventCalendarDayView, EventCalendarHeader, EventCalendarMonthView, EventCalendarRoot, EventCalendarWeekView, EventCalendarYearView, IEvent } from "@/components/ui/event-calendar";
import { DatabaseSchemas, DatabaseTables, PrimaryKey, TableMetadata, TableSchema } from "@/lib/database-meta.types";
import { useResourceContext } from "./resource-context";
import { updateResourceDataAction } from "../lib/actions";

export function ResourceCalendarView({
  view,
  data,
  tableSchema,
  currentView
}: {
  view: "day" | "week" | "month" | "year" | "agenda";
  data: IEvent[];
  tableSchema: TableSchema;
  currentView: Required<TableMetadata>["items"][number];
}) {
  const schema = tableSchema.schema as DatabaseSchemas;
  const resource = tableSchema.name as DatabaseTables<DatabaseSchemas>;

  const router = useRouter();
  const { setResourceAction } = useResourceContext();

  function onAddEvent(event: { startDate: Date; hour: number; minute: number }) {
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
      }
    });
  }

  async function onDragEvent(event: IEvent) {
    const startDateFieldName = currentView.startDate as string;
    const endDateFieldName = currentView.endDate as string;

    const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

    const pk = primaryKeys.reduce((pkAcc, pkField) => {
      pkAcc[pkField.name] = event.data?.[pkField.name];
      return pkAcc;
    }, {} as Record<string, unknown>);

    await updateResourceDataAction({
      schema,
      resourceName: resource,
      resourceIds: pk,
      data: {
        [startDateFieldName]: event.startDate,
        [endDateFieldName]: event.endDate,
      }
    });
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex justify-between items-center gap-2">
        <Button variant={"outline"}>
          Filter
        </Button>
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
        onEventClick={(event) => {
          setResourceAction({ variant: "view", data: event.data });
        }}
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
  )
}

function EventCalendarNavigation({
  view
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
  )
}

import { ListFilter } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";
import {
  EventCalendarAgendaView,
  EventCalendarContainer,
  EventCalendarDayView,
  EventCalendarHeader,
  EventCalendarMonthView,
  EventCalendarRoot,
  EventCalendarWeekView,
  EventCalendarYearView,
} from "@/components/ui/event-calendar";

export default async function Loading() {
  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "..." }]} />
      <div className="flex flex-col gap-2 px-4">
        <div className="flex items-center justify-between gap-2">
          <Button variant={"outline"} size={"sm"}>
            <ListFilter />
            Filter
          </Button>
        </div>
        <EventCalendarRoot events={[]} view="day">
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
    </div>
  );
}

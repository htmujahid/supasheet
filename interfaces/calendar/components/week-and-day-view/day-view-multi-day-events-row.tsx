import { parseISO, isWithinInterval, differenceInDays, startOfDay, endOfDay } from "date-fns";

import { MonthEventBadge } from "@/interfaces/calendar/components/month-view/month-event-badge";

import type { Event } from "@/interfaces/calendar/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IProps {
  selectedDate: Date;
  multiDayEvents: Event[];
}

export function DayViewMultiDayEventsRow({ selectedDate, multiDayEvents }: IProps) {
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const multiDayEventsInDay = multiDayEvents
    .filter(event => {
      const eventStart = parseISO(event.start_date);
      const eventEnd = parseISO(event.end_date);

      const isOverlapping =
        isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
        (eventStart <= dayStart && eventEnd >= dayEnd);

      return isOverlapping;
    })
    .sort((a, b) => {
      const durationA = differenceInDays(parseISO(a.end_date), parseISO(a.start_date));
      const durationB = differenceInDays(parseISO(b.end_date), parseISO(b.start_date));
      return durationB - durationA;
    });

  if (multiDayEventsInDay.length === 0) return null;

  return (
    <div className="flex border-b">
      <div className="w-18"></div>
      <ScrollArea className="flex-1 max-h-24" type="always">
        <div className="flex flex-col gap-1 border-l py-1">
          {multiDayEventsInDay.map(event => {
            const eventStart = startOfDay(parseISO(event.start_date));
            const eventEnd = startOfDay(parseISO(event.end_date));
            const currentDate = startOfDay(selectedDate);

            const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
            const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1;

            return <MonthEventBadge key={Object.values(event.pk).join("/")} event={event} cellDate={selectedDate} eventCurrentDay={eventCurrentDay} eventTotalDays={eventTotalDays} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

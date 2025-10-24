import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { ScrollArea } from "@/components/ui/scroll-area";

import { AddEventDialog } from "@/interfaces/calendar/components/dialogs/add-event-dialog";
import { EventBlock } from "@/interfaces/calendar/components/week-and-day-view/event-block";
import { CalendarTimeline } from "@/interfaces/calendar/components/week-and-day-view/calendar-time-line";
import { WeekViewMultiDayEventsRow } from "@/interfaces/calendar/components/week-and-day-view/week-view-multi-day-events-row";

import { cn } from "@/lib/utils";
import { groupEvents, getEventBlockStyle, isWorkingHour, getVisibleHours } from "@/interfaces/calendar/lib/helpers";

import type { Event } from "@/interfaces/calendar/lib/types";

interface IProps {
  singleDayEvents: Event[];
  multiDayEvents: Event[];
}

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, workingHours, visibleHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayEvents);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
        <p>Weekly view is not available on smaller devices.</p>
        <p>Please switch to daily or monthly view.</p>
      </div>

      <div className="hidden flex-col sm:flex h-[calc(100vh-175px)]">
        <div>
          <WeekViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Week header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7 divide-x border-l">
              {weekDays.map((day, index) => (
                <span key={index} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {format(day, "EE")} <span className="ml-1 font-semibold text-foreground">{format(day, "d")}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-full" type="always">
          <div className="flex overflow-hidden">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour, 0, 0, 0), "hh a")}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className="relative flex-1 border-l">
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(event => isSameDay(parseISO(event.start_date), day) || isSameDay(parseISO(event.end_date), day));
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={dayIndex} className="relative">
                      {hours.map((hour, index) => {
                        const isDisabled = !isWorkingHour(day, hour, workingHours);

                        return (
                          <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                            {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                              <AddEventDialog start_date={day} startTime={{ hour, minute: 0 }}>
                                <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>

                              <AddEventDialog start_date={day} startTime={{ hour, minute: 15 }}>
                                <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>

                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                              <AddEventDialog start_date={day} startTime={{ hour, minute: 30 }}>
                                <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>

                              <AddEventDialog start_date={day} startTime={{ hour, minute: 45 }}>
                                <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>
                          </div>
                        );
                      })}

                      {groupedEvents.map((group, groupIndex) =>
                        group.map(event => {
                          let style = getEventBlockStyle(event, day, groupIndex, groupedEvents.length, { from: earliestEventHour, to: latestEventHour });
                          const hasOverlap = groupedEvents.some(
                            (otherGroup, otherIndex) =>
                              otherIndex !== groupIndex &&
                              otherGroup.some(otherEvent =>
                                areIntervalsOverlapping(
                                  { start: parseISO(event.start_date), end: parseISO(event.end_date) },
                                  { start: parseISO(otherEvent.start_date), end: parseISO(otherEvent.end_date) }
                                )
                              )
                          );

                          if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

                          return (
                            <div key={Object.values(event.pk).join("/")} className="absolute p-1" style={style}>
                              <EventBlock event={event} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

import { CalendarIcon, Clock } from "lucide-react";
import { parseISO, areIntervalsOverlapping, format } from "date-fns";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AddEventDialog } from "@/interfaces/calendar/components/dialogs/add-event-dialog";
import { EventBlock } from "@/interfaces/calendar/components/week-and-day-view/event-block";
import { CalendarTimeline } from "@/interfaces/calendar/components/week-and-day-view/calendar-time-line";
import { DayViewMultiDayEventsRow } from "@/interfaces/calendar/components/week-and-day-view/day-view-multi-day-events-row";

import { cn } from "@/lib/utils";
import { groupEvents, getEventBlockStyle, isWorkingHour, getCurrentEvents, getVisibleHours } from "@/interfaces/calendar/lib/helpers";

import type { Event } from "@/interfaces/calendar/lib/types";

interface IProps {
  singleDayEvents: Event[];
  multiDayEvents: Event[];
}

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate, visibleHours, workingHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayEvents);

  const currentEvents = getCurrentEvents(singleDayEvents);

  const dayEvents = singleDayEvents.filter(event => {
    const eventDate = parseISO(event.start_date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col  h-[calc(100vh-175px)]">
        <div>
          <DayViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Day header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <span className="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
              {format(selectedDate, "EE")} <span className="font-semibold text-foreground">{format(selectedDate, "d")}</span>
            </span>
          </div>
        </div>

        <ScrollArea className="h-full" type="always">
          <div className="flex">
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

            {/* Day grid */}
            <div className="relative flex-1 border-l">
              <div className="relative">
                {hours.map((hour, index) => {
                  const isDisabled = !isWorkingHour(selectedDate, hour, workingHours);

                  return (
                    <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                      {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                      <AddEventDialog start_date={selectedDate} startTime={{ hour, minute: 0 }}>
                        <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </AddEventDialog>

                      <AddEventDialog start_date={selectedDate} startTime={{ hour, minute: 15 }}>
                        <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </AddEventDialog>

                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                      <AddEventDialog start_date={selectedDate} startTime={{ hour, minute: 30 }}>
                        <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </AddEventDialog>

                      <AddEventDialog start_date={selectedDate} startTime={{ hour, minute: 45 }}>
                        <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                      </AddEventDialog>
                    </div>
                  );
                })}

                {groupedEvents.map((group, groupIndex) =>
                  group.map(event => {
                    let style = getEventBlockStyle(event, selectedDate, groupIndex, groupedEvents.length, { from: earliestEventHour, to: latestEventHour });
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

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="hidden w-64 divide-y border-l md:block">
        <Calendar className="mx-auto w-fit" mode="single" selected={selectedDate} onSelect={setSelectedDate} />

        <div className="flex-1 space-y-3">
          {currentEvents.length > 0 ? (
            <div className="flex items-start gap-2 px-4 pt-4">
              <span className="relative mt-[5px] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
              </span>

              <p className="text-sm font-semibold text-foreground">Happening now</p>
            </div>
          ) : (
            <p className="p-4 text-center text-sm italic text-muted-foreground">No appointments or consultations at the moment</p>
          )}

          {currentEvents.length > 0 && (
            <ScrollArea className="h-[422px] px-4" type="always">
              <div className="space-y-6 pb-4">
                {currentEvents.map(event => {
                  return (
                    <div key={Object.values(event.pk).join("/")} className="space-y-1.5">
                      <p className="line-clamp-2 text-sm font-semibold">{event.title}</p>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarIcon className="size-3.5" />
                        <span className="text-sm">{format(new Date(), "MMM d, yyyy")}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span className="text-sm">
                          {format(parseISO(event.start_date), "h:mm a")} - {format(parseISO(event.end_date), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

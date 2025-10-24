"use client";

import { format, parseISO } from "date-fns";
import { Clock, Text } from "lucide-react";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { EventDetailsDialog } from "@/interfaces/calendar/components/dialogs/event-details-dialog";

import type { Event } from "@/interfaces/calendar/lib/types";

interface IProps {
  event: Event;
  eventCurrentDay?: number;
  eventTotalDays?: number;
}

export function AgendaEventCard({ event, eventCurrentDay, eventTotalDays }: IProps) {
  const start_date = parseISO(event.start_date);
  const end_date = parseISO(event.end_date);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <EventDetailsDialog event={event}>
      <div role="button" tabIndex={0} className={"flex select-none items-center justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600"} onKeyDown={handleKeyDown}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <svg width="8" height="8" viewBox="0 0 8 8" className="event-dot shrink-0">
              <circle cx="4" cy="4" r="4" />
            </svg>

            <p className="font-medium">
              {eventCurrentDay && eventTotalDays && (
                <span className="mr-1 text-xs">
                  Day {eventCurrentDay} of {eventTotalDays} •{" "}
                </span>
              )}
              {event.title}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="size-3 shrink-0" />
            <p className="text-xs text-foreground">
              {format(start_date, "h:mm a")} - {format(end_date, "h:mm a")}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Text className="size-3 shrink-0" />
            <p className="text-xs text-foreground">{event.description}</p>
          </div>
        </div>
      </div>
    </EventDetailsDialog>
  );
}

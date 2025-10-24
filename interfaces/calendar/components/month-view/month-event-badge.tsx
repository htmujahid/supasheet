import { cva } from "class-variance-authority";
import { endOfDay, format, isSameDay, parseISO, startOfDay } from "date-fns";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { EventDetailsDialog } from "@/interfaces/calendar/components/dialogs/event-details-dialog";

import { cn } from "@/lib/utils";

import type { Event } from "@/interfaces/calendar/lib/types";
import type { VariantProps } from "class-variance-authority";

const eventBadgeVariants = cva(
  "mx-1 flex size-auto h-6.5 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-neutral-50 dark:bg-neutral-900 [&_.event-dot]:fill-neutral-600",
  {
    variants: {
      multiDayPosition: {
        first: "relative z-10 mr-0 w-[calc(100%_-_3px)] rounded-r-none border-r-0 [&>span]:mr-2.5",
        middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
        last: "ml-0 rounded-l-none border-l-0",
        none: "",
      },
    },
  }
);

interface IProps extends Omit<VariantProps<typeof eventBadgeVariants>, "color" | "multiDayPosition"> {
  event: Event;
  cellDate: Date;
  eventCurrentDay?: number;
  eventTotalDays?: number;
  className?: string;
  position?: "first" | "middle" | "last" | "none";
}

export function MonthEventBadge({ event, cellDate, eventCurrentDay, eventTotalDays, className, position: propPosition }: IProps) {
  const itemStart = startOfDay(parseISO(event.start_date));
  const itemEnd = endOfDay(parseISO(event.end_date));

  if (cellDate < itemStart || cellDate > itemEnd) return null;

  let position: "first" | "middle" | "last" | "none" | undefined;

  if (propPosition) {
    position = propPosition;
  } else if (eventCurrentDay && eventTotalDays) {
    position = "none";
  } else if (isSameDay(itemStart, itemEnd)) {
    position = "none";
  } else if (isSameDay(cellDate, itemStart)) {
    position = "first";
  } else if (isSameDay(cellDate, itemEnd)) {
    position = "last";
  } else {
    position = "middle";
  }

  const renderBadgeText = ["first", "none"].includes(position);

  const eventBadgeClasses = cn(eventBadgeVariants({ multiDayPosition: position, className }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
      <EventDetailsDialog event={event}>
        <div role="button" tabIndex={0} className={eventBadgeClasses} onKeyDown={handleKeyDown}>
          <div className="flex items-center gap-1.5 truncate">
            {!["middle", "last"].includes(position) && (
              <svg width="8" height="8" viewBox="0 0 8 8" className="event-dot shrink-0">
                <circle cx="4" cy="4" r="4" />
              </svg>
            )}

            {renderBadgeText && (
              <p className="flex-1 truncate font-semibold">
                {eventCurrentDay && (
                  <span className="text-xs">
                    Day {eventCurrentDay} of {eventTotalDays} •{" "}
                  </span>
                )}
                {event.title}
              </p>
            )}
          </div>

          {renderBadgeText && <span>{format(new Date(event.start_date), "h:mm a")}</span>}
        </div>
      </EventDetailsDialog>
  );
}

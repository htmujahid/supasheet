import { isToday } from "date-fns";
import { useRouter } from "next/navigation";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { cn } from "@/lib/utils";

import type { Event } from "@/interfaces/calendar/lib/types";

interface IProps {
  day: number;
  date: Date;
  events: Event[];
}

export function YearViewDayCell({ day, date, events }: IProps) {
  const { push } = useRouter();
  const { setSelectedDate } = useCalendar();

  const maxIndicators = 3;
  const eventCount = events.length;

  const handleClick = () => {
    setSelectedDate(date);
    push("?searchView=day");
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex h-11 flex-1 flex-col items-center justify-start gap-0.5 rounded-md pt-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs font-medium",
          isToday(date) && "bg-primary font-semibold text-primary-foreground"
        )}
      >
        {day}
      </div>

      {eventCount > 0 && (
        <div className="mt-0.5 flex gap-0.5">
          {eventCount <= maxIndicators ? (
            events.map(event => (
              <div
                key={Object.values(event.pk).join("/")}
                className={
                  "size-1.5 rounded-full bg-neutral-600"
                }
              />
            ))
          ) : (
            <>
              <div
                className={"size-1.5 rounded-full"}
              />
              <span className="text-[7px] text-muted-foreground">+{eventCount - 1}</span>
            </>
          )}
        </div>
      )}
    </button>
  );
}

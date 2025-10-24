import Link from "next/link";
import { Columns, Grid3x3, List, Grid2x2, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TodayButton } from "@/interfaces/calendar/components/header/today-button";
import { DateNavigator } from "@/interfaces/calendar/components/header/date-navigator";

import type { Event } from "@/interfaces/calendar/lib/types";
import type { CalendarView } from "@/interfaces/calendar/lib/types";

interface IProps {
  view: CalendarView;
  events: Event[];
}

export function CalendarHeader({ view, events }: IProps) {
  return (
    <div className="flex flex-col gap-2 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <TodayButton />
      <DateNavigator view={view} events={events} />
    </div>
  );
}

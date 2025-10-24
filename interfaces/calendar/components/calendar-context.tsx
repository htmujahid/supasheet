"use client";

import { createContext, useContext, useState } from "react";

import type { Event } from "@/interfaces/calendar/lib/types";
import type { VisibleHours, WorkingHours } from "@/interfaces/calendar/lib/types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  workingHours: WorkingHours;
  visibleHours: VisibleHours;
  events: Event[];
}

const CalendarContext = createContext({} as ICalendarContext);

const WORKING_HOURS = {
  0: { from: 0, to: 24 },
  1: { from: 0, to: 24 },
  2: { from: 0, to: 24 },
  3: { from: 0, to: 24 },
  4: { from: 0, to: 24 },
  5: { from: 0, to: 24 },
  6: { from: 0, to: 24 },
};

const VISIBLE_HOURS = { from: 0, to: 24 };

export function CalendarProvider({ children, events }: { children: React.ReactNode; events: Event[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        visibleHours: VISIBLE_HOURS,
        workingHours: WORKING_HOURS,
        // If you go to the refetch approach, you can remove the localEvents and pass the events directly
        events,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}

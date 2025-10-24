"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/interfaces/calendar/components/calendar-context";

import { CalendarHeader } from "@/interfaces/calendar/components/header/calendar-header";
import { CalendarYearView } from "@/interfaces/calendar/components/year-view/calendar-year-view";
import { CalendarMonthView } from "@/interfaces/calendar/components/month-view/calendar-month-view";
import { CalendarAgendaView } from "@/interfaces/calendar/components/agenda-view/calendar-agenda-view";
import { CalendarDayView } from "@/interfaces/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/interfaces/calendar/components/week-and-day-view/calendar-week-view";

import type { CalendarView } from "@/interfaces/calendar/lib/types";

export function ResourceCalendarView({ view }: { view: CalendarView }) {
  const { selectedDate, events } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = parseISO(event.end_date);

      if (view === "year") {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        const isInSelectedYear = eventStartDate <= yearEnd && eventEndDate >= yearStart;
        return isInSelectedYear;
      }

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        return isInSelectedMonth;
      }

      if (view === "week") {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek = eventStartDate <= weekEnd && eventEndDate >= weekStart;
        return isInSelectedWeek;
      }

      if (view === "day") {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        const isInSelectedDay = eventStartDate <= dayEnd && eventEndDate >= dayStart;
        return isInSelectedDay;
      }
    });
  }, [selectedDate, events, view]);

  const singleDayEvents = filteredEvents.filter(event => {
    const start_date = parseISO(event.start_date);
    const end_date = parseISO(event.end_date);
    return isSameDay(start_date, end_date);
  });

  const multiDayEvents = filteredEvents.filter(event => {
    const start_date = parseISO(event.start_date);
    const end_date = parseISO(event.end_date);
    return !isSameDay(start_date, end_date);
  });

  // For year view, we only care about the start date
  // by using the same date for both start and end,
  // we ensure only the start day will show a dot
  const eventStartDates = useMemo(() => {
    return filteredEvents.map(event => ({ ...event, end_date: event.start_date }));
  }, [filteredEvents]);

  return (
    <div className="overflow-hidden rounded-xl border">
      <CalendarHeader view={view} events={filteredEvents} />

      <>
        {view === "day" && <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "week" && <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "month" && <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "year" && <CalendarYearView allEvents={eventStartDates} />}
        {view === "agenda" && <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
      </>
    </div>
  );
}

export type CalendarView = "day" | "week" | "month" | "year" | "agenda";
export type WorkingHours = { [key: number]: { from: number; to: number } };
export type VisibleHours = { from: number; to: number };

export type Event = {
  pk: Record<string, unknown>;
  start_date: string;
  end_date: string;
  title: string;
  description: string;
}

export type CalendarCell = {
  day: number;
  currentMonth: boolean;
  date: Date;
}

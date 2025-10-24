import { TableMetadata, ViewMetadata } from "@/lib/database-meta.types";

export type TableResource = {
  name: string;
  id: string;
  schema: string;
  type: "table";
  meta: TableMetadata;
};

export type ViewResource = {
  name: string;
  id: string;
  schema: string;
  type: "view";
  meta: ViewMetadata;
};

export type Resource = TableResource | ViewResource;

export type BoardViewData = {
  pk: Record<string, unknown>;
  title: string;
  description: string;
  date: string;
  badge: string;
};

export type BoardViewReducedData = Record<string, BoardViewData[]>;

export type ListViewData = {
  pk: Record<string, unknown>;
  title: string;
  description: string;
  date: string;
  badge: string;
};

export type ListViewReducedData = Record<string, ListViewData[]>;

export type CalendarViewData = {
  pk: Record<string, unknown>;
  start_date: string;
  end_date: string;
  title: string;
  description: string;
};

export type GanttViewData = {
  pk: Record<string, unknown>;
  start_date: string;
  end_date: string;
  title: string;
};

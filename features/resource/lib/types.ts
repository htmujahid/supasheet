import { UniqueIdentifier } from "@dnd-kit/core";

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

export type KanbanViewData = {
  title: string;
  description: string;
  date: string;
  badge: string;
  data: Record<string, unknown>;
};

export type KanbanViewReducedData = Record<UniqueIdentifier, KanbanViewData[]>;

export type CalendarViewData = {
  start_date: string;
  end_date: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
};

export type GalleryViewData = {
  title: string;
  description: string;
  cover: string;
  badge: string;
  data: Record<string, unknown>;
};

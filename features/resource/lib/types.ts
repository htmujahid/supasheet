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

export type KanbanViewData = {
  pk: Record<string, unknown>;
  title: string;
  description: string;
  date: string;
  badge: string;
};

export type KanbanViewReducedData = Record<string, KanbanViewData[]>;

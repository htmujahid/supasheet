import type { UseFormReturn } from "react-hook-form";

import type { TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

export type ColumnInput = {
  variant:
    | "uuid"
    | "text"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "json"
    | "select"
    | "multiSelect"
    | "time";
  defaultValue: unknown;
  required: boolean;
  disabled: boolean;
};

export type FieldProps = {
  form: UseFormReturn<TableSchema>;
  columnInput: ColumnInput;
  column: Tables<"_pg_meta_columns">;
};

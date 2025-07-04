import type { ControllerRenderProps } from "react-hook-form";

import type { TableSchema } from "@/lib/database-meta.types";

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
  defaultValue: string | null;
  required: boolean;
  disabled: boolean;
  dynamicDisabled?: boolean;
  options?: string[];
};

export type FieldProps = {
  field: ControllerRenderProps<TableSchema, string>;
  columnInput: ColumnInput;
  disabled?: boolean;
};

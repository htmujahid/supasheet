import type { Control, ControllerRenderProps, UseFormReturn } from "react-hook-form";

import type { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

export type ColumnInput = {
  label: string;
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
  icon: string | null;
  defaultValue: string | null;
  required: boolean;
  disabled: boolean;
  dynamicDisabled?: boolean;
  isArray: boolean;
  options?: string[];
};

export type FieldProps = {
  field: ControllerRenderProps<ResourceDataSchema, string>;
  columnInput: ColumnInput;
  disabled?: boolean;
};

// File field types
export const UPLOADS_BUCKET = "uploads";

export type UploadProgress = {
  fileId: string;
  progress: number;
  completed: boolean;
  error?: string;
};

export type FileFieldConfig = {
  maxSize?: number;
  maxFiles?: number;
  accept?: string;
};

export type FileFieldProps = {
  form: UseFormReturn<ResourceDataSchema>
  columnInput: FieldProps["columnInput"]
  field: FieldProps["field"]
  control: Control<ResourceDataSchema>
  columnSchema: ColumnSchema
}

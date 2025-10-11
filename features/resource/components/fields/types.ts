import type { ReactElement } from "react";
import type { Control, ControllerRenderProps, UseFormReturn } from "react-hook-form";

import type { ColumnSchema, ResourceDataSchema } from "@/lib/database-meta.types";

export type ColumnMetadata = {
  label: string;
  type:
    | "uuid"
    | "text"
    | "longtext"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "json"
    | "select"
    | "time"
    | "money"
    | "file"
    | "email"
    | "tel"
    | "url"
    | "rating"
    | "percentage"
    | "color"
    | "duration"
    | "array";
  icon: ReactElement | null;
  defaultValue: string | null;
  required: boolean;
  disabled: boolean;
  dynamicDisabled?: boolean;
  isArray: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export type FieldProps = {
  field: ControllerRenderProps<ResourceDataSchema, string>;
  columnMetadata: ColumnMetadata;
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
  columnMetadata: FieldProps["columnMetadata"]
  field: FieldProps["field"]
  control: Control<ResourceDataSchema>
  columnSchema: ColumnSchema
}

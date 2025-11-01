import type { ReactElement } from "react";

import type {
  Control,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";

import type {
  ColumnSchema,
  PrimaryKey,
  Relationship,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

export type ColumnMetadata = {
  label: string;
  variant:
    | "uuid"
    | "text"
    | "long_text"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "json"
    | "select"
    | "time"
    | "money"
    | "file"
    | "avatar"
    | "rich_text"
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
  isArray: boolean;
  isMetadata: boolean;
  isPrimaryKey: boolean;
  relationship: Relationship | undefined;
  comment: string | null;
  primaryKeys: PrimaryKey[];
  table: string;
  schema: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type ColumnMeta = {
  label: string;
  variant: "text" | "number" | "date" | "boolean" | "multiSelect" | "select";
  options?: { label: string; value: string }[];
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
  form: UseFormReturn<ResourceDataSchema>;
  columnMetadata: FieldProps["columnMetadata"];
  field: FieldProps["field"];
  control: Control<ResourceDataSchema>;
  columnSchema: ColumnSchema;
};

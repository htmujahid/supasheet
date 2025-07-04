import type { Tables } from "@/lib/database.types";

import type { ColumnInput } from "./types";

export function getColumnInputField(
  columnSchema: Tables<"_pg_meta_columns">,
): ColumnInput {
  let defaultValue: string | null = null;

  if (columnSchema.default_value === "NULL") {
    defaultValue = null;
  } else if (columnSchema.default_value) {
    defaultValue = columnSchema.default_value;
  } else {
    defaultValue = null;
  }

  const required = columnSchema.is_nullable === false;
  const disabled = columnSchema.is_generated || !columnSchema.is_updatable;

  switch (columnSchema.data_type) {
    case "uuid":
      return {
        variant: "uuid",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "character":
    case "character varying":
    case "text":
    case "bit":
    case "bit varying":
    case "bytea":
      return {
        variant: "text",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "double precision":
    case "real":
    case "bigint":
    case "bigserial":
    case "integer":
    case "numeric":
    case "smallint":
    case "smallserial":
    case "serial":
    case "money":
      return {
        variant: "number",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "date":
      return {
        variant: "date",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };
    case "time":
    case "time with time zone":
    case "time without time zone":
      return {
        variant: "time",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "timestamp":
      return {
        variant: "datetime",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "json":
    case "jsonb":
      return {
        variant: "json",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "boolean":
      return {
        variant: "boolean",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };

    case "USER-DEFINED":
      return {
        variant: "select",
        defaultValue,
        required,
        disabled,
        options: columnSchema.enums?.toString().split(",") ?? undefined,
      };
    default:
      return {
        variant: "text",
        defaultValue,
        required,
        disabled,
        options: undefined,
      };
  }
}

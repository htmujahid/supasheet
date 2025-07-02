import type { Tables } from "@/lib/database.types";

import type { ColumnInput } from "./types";

export function getColumnInputField(
  columnSchema: Tables<"_pg_meta_columns">,
): ColumnInput {
  let defaultValue: unknown = "";

  if (columnSchema.default_value === "NULL") {
    defaultValue = null;
  } else if (
    columnSchema.default_value === "gen_random_uuid()" ||
    columnSchema.default_value === "uuid_generate_v4()"
  ) {
    defaultValue = crypto.randomUUID();
  } else if (columnSchema.default_value === "now()") {
    defaultValue = new Date();
  } else if (columnSchema.default_value) {
    defaultValue = columnSchema.default_value;
  } else {
    defaultValue = undefined;
  }

  if (typeof defaultValue === "string") {
    defaultValue = defaultValue.split("::")[0]?.replaceAll("'", "") ?? null;
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
      };

    case "date":
      return {
        variant: "date",
        defaultValue,
        required,
        disabled,
      };
    case "time with time zone":
    case "time without time zone":
      return {
        variant: "time",
        defaultValue,
        required,
        disabled,
      };
    case "time":
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "timestamp":
      return {
        variant: "datetime",
        defaultValue,
        required,
        disabled,
      };

    case "json":
    case "jsonb":
      return {
        variant: "json",
        defaultValue,
        required,
        disabled,
      };

    case "boolean":
      return {
        variant: "boolean",
        defaultValue,
        required,
        disabled,
      };

    case "USER-DEFINED":
      return {
        variant: "select",
        defaultValue,
        required,
        disabled,
      };
    default:
      return {
        variant: "text",
        defaultValue,
        required,
        disabled,
      };
  }
}

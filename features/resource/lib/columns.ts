import { ColumnSchema } from "@/lib/database-meta.types";
import { ColumnInput } from "../components/fields/types";

export function getColumnCell(columnSchema: ColumnSchema) {
  switch (columnSchema.data_type) {
    case "json":
    case "jsonb":
      return "json";

    case "ARRAY":
      return "array";

    default:
      return "text";
  }
}

export function getColumnData(columnSchema: ColumnSchema): ColumnInput {
  let format = columnSchema.format?.startsWith("_") ? columnSchema.format?.slice(1) : columnSchema.format;

  let defaultValue: string | null = null;

  if (columnSchema.default_value === "NULL") {
    defaultValue = null;
  } else if (columnSchema.default_value) {
    defaultValue = columnSchema.default_value;
  } else {
    defaultValue = null;
  }

  const label = columnSchema.name as string;
  const required = columnSchema.is_nullable === false;
  const disabled = columnSchema.is_generated || !columnSchema.is_updatable;
  const isArray = columnSchema.data_type === "ARRAY";
  const variant = getColumnVariant(format ?? undefined).variant;

  return {
    label,
    variant,
    icon: format,
    defaultValue,
    disabled,
    required,
    isArray,
    options: columnSchema.enums?.toString().split(",") ?? undefined,
  }
}

export function getColumnVariant(format?: string): {variant: ColumnInput["variant"]} {
  switch (format) {
    case "uuid":
      return {
        variant: "uuid",
      };

    case "character":
    case "varchar":
    case "text":
    case "bit":
    case "varbit":
    case "bytea":
      return {
        variant: "text",
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
      };

    case "date":
      return {
        variant: "date",
      };
    case "time":
    case "timetz":
      return {
        variant: "time",
      };
    case "timestamptz":
    case "timestamp":
      return {
        variant: "datetime",
      };

    case "json":
    case "jsonb":
      return {
        variant: "json",
      };

    case "bool":
      return {
        variant: "boolean",
      };

    default:
      return {
        variant: "text",
      };
  }
}

export function getColumnMeta(columnSchema: ColumnSchema) {
  switch (columnSchema.data_type) {
    case "character":
    case "varchar":
    case "text":
    case "uuid":
    case "bit":
    case "varbit":
    case "bytea":
      return {
        label: columnSchema.name,
        variant: "text",
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
        label: columnSchema.name,
        variant: "number",
      };

    case "date":
    case "timetz":
    case "time":
    case "timestamptz":
    case "timestamp":
      return {
        label: columnSchema.name,
        variant: "date",
      };

    case "json":
    case "jsonb":
      return {
        label: columnSchema.name,
        variant: "text",
      };

    case "boolean":
      return {
        label: columnSchema.name,
        variant: "boolean",
      };

    case "USER-DEFINED":
      return {
        label: columnSchema.name,
        variant: "multiSelect",
        options:
          (columnSchema.enums as string[])?.map((option) => ({
            label: option,
            value: option,
          })) ?? [],
      };
    default:
      return {
        label: columnSchema.name,
        variant: "text",
      };
  }
}

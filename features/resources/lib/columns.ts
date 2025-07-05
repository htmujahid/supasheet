import { Tables } from "@/lib/database.types";

export function getColumnCell(columnSchema: Tables<"_pg_meta_columns">) {
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

export function getColumnMeta(columnSchema: Tables<"_pg_meta_columns">) {
  switch (columnSchema.data_type) {
    case "character":
    case "character varying":
    case "text":
    case "uuid":
    case "bit":
    case "bit varying":
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
    case "time with time zone":
    case "time without time zone":
    case "time":
    case "timestamp with time zone":
    case "timestamp without time zone":
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

import type { Column } from "@tanstack/react-table";

import { dataTableConfig } from "@/config/data-table.config";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/types/data-table";

import { Tables } from "./database.types";

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px hsl(var(--border)) inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px hsl(var(--border)) inset"
          : undefined
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    background: isPinned ? "hsl(var(--background))" : "hsl(var(--background))",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "empty" ||
      filter.operator === "not.empty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined),
  );
}

export function getColumnInputField(columnSchema: Tables<"_pg_meta_columns">) {
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

  const required = columnSchema.is_nullable === false;
  const disabled = columnSchema.is_generated || !columnSchema.is_updatable;

  switch (columnSchema.data_type) {
    case "uuid":
      return {
        variant: "input",
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
        defaultValue:
          (defaultValue as string)?.split("::")[0]?.replaceAll("'", "") ??
          undefined,
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
        defaultValue:
          (defaultValue as string)?.split("::")[0]?.replaceAll("'", "") ?? "",
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

export function getColumnCell(columnSchema: Tables<"_pg_meta_columns">) {
  switch (columnSchema.data_type) {
    case "json":
    case "jsonb":
      return "json";
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

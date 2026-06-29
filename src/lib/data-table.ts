import { filtersConfig } from "#/config/filters.config"
import type { FilterOperator, FilterVariant } from "#/types/data-table"

export function getFilterOperators(variant: FilterVariant) {
  switch (variant) {
    case "text":
      return filtersConfig.textOperators
    case "number":
    case "range":
      return filtersConfig.numericOperators
    case "date":
    case "time":
    case "timetz":
    case "timestamp":
    case "timestamptz":
      return filtersConfig.dateOperators
    case "select":
      return filtersConfig.selectOperators
    case "multiSelect":
      return filtersConfig.multiSelectOperators
    case "boolean":
      return filtersConfig.booleanOperators
    case "uuid":
      return filtersConfig.uuidOperators
    default:
      return filtersConfig.textOperators
  }
}

export function getDefaultFilterOperator(
  variant: FilterVariant
): FilterOperator {
  return getFilterOperators(variant)[0]?.value ?? "eq"
}

/**
 * Encode operator + value into a single string stored in ColumnFiltersState.value.
 * Format: "<operator>.<value>"
 * Examples: "ilike.fix", "in.todo,in-progress", "not.ilike.crash", "is."
 */
export function encodeFilterValue(
  operator: FilterOperator,
  value: string | string[]
): string {
  const valStr = Array.isArray(value) ? value.join(",") : String(value)
  return `${operator}.${valStr}`
}

/**
 * Decode a ColumnFiltersState value string back into operator + raw value.
 * Handles "not.*" operators which contain a dot in the operator name.
 */
export function decodeFilterValue(encoded: string): {
  operator: FilterOperator
  value: string
} {
  if (encoded.startsWith("not.")) {
    const afterNot = encoded.slice(4)
    const dotIdx = afterNot.indexOf(".")
    if (dotIdx === -1)
      return { operator: `not.${afterNot}` as FilterOperator, value: "" }
    return {
      operator: `not.${afterNot.slice(0, dotIdx)}` as FilterOperator,
      value: afterNot.slice(dotIdx + 1),
    }
  }
  const dotIdx = encoded.indexOf(".")
  if (dotIdx === -1) return { operator: encoded as FilterOperator, value: "" }
  return {
    operator: encoded.slice(0, dotIdx) as FilterOperator,
    value: encoded.slice(dotIdx + 1),
  }
}

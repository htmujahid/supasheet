import type { RenderEditCellProps } from "react-data-grid"
import { renderTextEditor } from "react-data-grid"

import {
  BooleanEditor,
  NumberEditor,
  SelectEditor,
} from "#/components/ui/data-grid"
import type { ColumnMetadata } from "#/types/fields"

type GridRow = Record<string, unknown>

const NO_EDIT_VARIANTS = new Set([
  "json",
  "array",
  "rich_text",
  "file",
  "avatar",
])

const NUMBER_VARIANTS = new Set([
  "number",
  "money",
  "rating",
  "percentage",
  "duration",
])

export function getEditCell(
  meta: ColumnMetadata | undefined
): ((props: RenderEditCellProps<GridRow>) => React.ReactNode) | undefined {
  if (!meta || meta.disabled || meta.isPrimaryKey) return undefined
  if (NO_EDIT_VARIANTS.has(meta.variant)) return undefined
  if (meta.variant === "boolean") return BooleanEditor
  if (NUMBER_VARIANTS.has(meta.variant)) return NumberEditor
  if (meta.variant === "select") {
    const options = meta.options?.map((o) => o.value) ?? []
    return (props: RenderEditCellProps<GridRow>) => (
      <SelectEditor {...props} options={options} />
    )
  }
  return renderTextEditor
}

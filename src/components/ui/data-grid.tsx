import type { RenderEditCellProps } from "react-data-grid"
import "react-data-grid/lib/styles.css"

export { DataGrid } from "react-data-grid"

export function SelectEditor<TRow>({
  row,
  column,
  onRowChange,
  onClose,
  options,
}: RenderEditCellProps<TRow> & { options: string[] }) {
  return (
    <select
      autoFocus
      className="w-full h-full px-2 outline-none bg-card text-card-foreground text-sm"
      value={String(row[column.key as keyof TRow])}
      onChange={(e) =>
        onRowChange({ ...row, [column.key]: e.target.value }, true)
      }
      onBlur={() => onClose(true)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

export function BooleanEditor<TRow>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow>) {
  return (
    <select
      autoFocus
      className="w-full h-full px-2 outline-none bg-card text-card-foreground text-sm"
      value={row[column.key as keyof TRow] ? "Yes" : "No"}
      onChange={(e) =>
        onRowChange({ ...row, [column.key]: e.target.value === "Yes" }, true)
      }
      onBlur={() => onClose(true)}
    >
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  )
}

export function NumberEditor<TRow>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow>) {
  return (
    <input
      autoFocus
      type="number"
      min={0}
      className="w-full h-full px-2 outline-none bg-card text-card-foreground text-sm"
      value={Number(row[column.key as keyof TRow])}
      onChange={(e) =>
        onRowChange({ ...row, [column.key]: e.target.valueAsNumber })
      }
      onBlur={() => onClose(true)}
    />
  )
}

import type { Table } from "@tanstack/react-table"

export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string
    excludeColumns?: (keyof TData | "select" | "actions")[]
    onlySelected?: boolean
  } = {}
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts

  const columns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        !excludeColumns.includes(
          column.id as keyof TData | "select" | "actions"
        )
    )

  const csvContent = [
    columns
      .map((column) => {
        // Display label for end users; falls back to the column id (name).
        const label = column.columnDef.meta?.name ?? column.id
        return `"${label.replace(/"/g, '""')}"`
      })
      .join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      columns
        .map((column) => {
          // Always look up the value by the column id (the data key).
          const cellValue = row.getValue(column.id)
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue
        })
        .join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

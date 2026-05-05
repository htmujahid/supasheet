import { useMemo, useState } from "react"

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CopyIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "#/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"

type SortState = { key: string; dir: "asc" | "desc" } | null

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return ""
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

function compare(a: unknown, b: unknown): number {
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

function toCsv(columns: string[], rows: Record<string, unknown>[]): string {
  const escape = (v: unknown) => {
    const s = formatCell(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    columns.join(","),
    ...rows.map((r) => columns.map((c) => escape(r[c])).join(",")),
  ].join("\n")
}

export function ResultTable({
  rows,
  summary,
}: {
  rows: Record<string, unknown>[]
  summary: string
}) {
  const [sort, setSort] = useState<SortState>(null)

  const columns = useMemo(
    () => (rows.length > 0 ? Object.keys(rows[0]) : []),
    [rows],
  )

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const sorted = [...rows].sort((a, b) => compare(a[sort.key], b[sort.key]))
    return sort.dir === "desc" ? sorted.reverse() : sorted
  }, [rows, sort])

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" }
      if (prev.dir === "asc") return { key, dir: "desc" }
      return null
    })
  }

  async function copyCsv() {
    try {
      await navigator.clipboard.writeText(toCsv(columns, sortedRows))
      toast.success("Copied CSV to clipboard")
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  if (rows.length === 0) {
    return (
      <Card size="sm">
        <CardContent className="text-sm text-muted-foreground">
          No rows. {summary}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const active = sort?.key === col
                const Icon = !active
                  ? ArrowUpDownIcon
                  : sort.dir === "asc"
                    ? ArrowUpIcon
                    : ArrowDownIcon
                return (
                  <TableHead key={col}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {col}
                      <Icon className="size-3 opacity-60" />
                    </button>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col} className="font-mono text-xs">
                    {formatCell(row[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {rows.length} {rows.length === 1 ? "row" : "rows"}
        </span>
        <Button variant="outline" size="sm" onClick={copyCsv}>
          <CopyIcon />
          Copy CSV
        </Button>
      </CardFooter>
    </Card>
  )
}

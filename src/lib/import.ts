import { coerceColumnValue } from "#/lib/columns"
import type { ColumnSchema } from "#/lib/database-meta.types"

export const IMPORT_BATCH_SIZE = 500

export interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
}

export function parseCSV(text: string): ParsedCSV {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return { headers: [], rows: [] }

  const parseRow = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += ch
      }
    }
    result.push(current)
    return result
  }

  const headers = parseRow(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = parseRow(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]))
  })

  return { headers, rows }
}

export function matchHeaders(
  csvHeaders: string[],
  columnsSchema: ColumnSchema[]
): { matched: string[]; unmatched: string[] } {
  const tableNames = new Set(
    columnsSchema.map((c) => c.name?.toLowerCase() ?? "")
  )
  return {
    matched: csvHeaders.filter((h) => tableNames.has(h.toLowerCase())),
    unmatched: csvHeaders.filter((h) => !tableNames.has(h.toLowerCase())),
  }
}

export function coerceImportRow(
  rawRow: Record<string, string>,
  matchedHeaders: string[],
  columnMap: Map<string, ColumnSchema>
): Record<string, unknown> {
  return Object.fromEntries(
    matchedHeaders
      .map((h) => {
        const col = columnMap.get(h.toLowerCase())
        return [h, coerceColumnValue(rawRow[h], col)] as [string, unknown]
      })
      .filter(([, v]) => v !== null && v !== undefined)
  )
}

export function buildColumnMap(
  columnsSchema: ColumnSchema[]
): Map<string, ColumnSchema> {
  return new Map(columnsSchema.map((c) => [c.name?.toLowerCase() ?? "", c]))
}

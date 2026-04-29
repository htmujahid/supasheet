import type {
  ColumnSchema,
  PrimaryKey,
  TableMetadata,
} from "#/lib/database-meta.types"

export function isSkippedForUpdate(
  col: ColumnSchema,
  primaryKeys: PrimaryKey[],
  columnsMeta: TableMetadata["columns"]
): boolean {
  if (primaryKeys.some((pk) => pk.name === col.name)) return true
  const name = col.name ?? col.id
  if (columnsMeta?.readOnly?.includes(name)) return true
  if (columnsMeta?.writeOnce?.includes(name)) return true
  return false
}

export function isSkippedForCreate(
  col: ColumnSchema,
  columnsMeta: TableMetadata["columns"]
): boolean {
  if (col.is_identity ?? false) return true
  if (columnsMeta?.readOnly?.includes(col.name ?? col.id)) return true
  return false
}

export function getUpdateInitialValue(
  col: ColumnSchema,
  record: Record<string, unknown>
): unknown {
  const val = record[col.name ?? col.id]
  if (val === null || val === undefined) return ""
  if (col.data_type === "ARRAY") return Array.isArray(val) ? val : []
  if (col.format === "json" || col.format === "jsonb") {
    return typeof val === "string" ? val : JSON.stringify(val, null, 2)
  }
  return val
}

export function getCreateInitialValue(col: ColumnSchema): unknown {
  if (col.data_type === "ARRAY") return []
  return ""
}

export function buildUpdatePayload(
  value: Record<string, unknown>,
  cols: ColumnSchema[]
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) {
    const col = cols.find((c) => (c.name ?? c.id) === k)
    if (v === "" || v === null || v === undefined) {
      payload[k] = null
    } else if (
      col &&
      (col.format === "json" || col.format === "jsonb") &&
      typeof v === "string"
    ) {
      try {
        payload[k] = JSON.parse(v)
      } catch {
        payload[k] = v
      }
    } else {
      payload[k] = v
    }
  }
  return payload
}

export function buildCreatePayload(
  value: Record<string, unknown>,
  cols: ColumnSchema[]
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) {
    if (v === "" || v === null || v === undefined) continue
    const col = cols.find((c) => (c.name ?? c.id) === k)
    if (
      col &&
      (col.format === "json" || col.format === "jsonb") &&
      typeof v === "string"
    ) {
      try {
        payload[k] = JSON.parse(v)
      } catch {
        payload[k] = v
      }
    } else {
      payload[k] = v
    }
  }
  return payload
}

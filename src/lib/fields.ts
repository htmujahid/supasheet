import type { PrimaryKey, ResourceDataSchema } from "./database-meta.types"

export function getPkValue(
  data: ResourceDataSchema,
  primaryKeys: PrimaryKey[]
): string {
  return String(data[primaryKeys[0]?.name] ?? "")
}

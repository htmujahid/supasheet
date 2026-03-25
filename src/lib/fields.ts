import type { PrimaryKey, ResourceDataSchema } from "./database-meta.types"

export function buildPkSplat(
  data: ResourceDataSchema,
  primaryKeys: PrimaryKey[]
) {
  //   join with / use data[pk.name]
  return primaryKeys.map((pk) => data[pk.name]).join("/")
}

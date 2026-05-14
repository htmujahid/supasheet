import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import type { TableMetadata } from "#/lib/database-meta.types"
import { tableSchemaQueryOptions } from "#/lib/supabase/data/resource"

export function useInlineFormFlag(schema: string, resource: string) {
  const { data: tableSchema } = useQuery({
    ...tableSchemaQueryOptions(schema as never, resource as never),
    enabled: Boolean(schema && resource),
  })
  return useMemo(() => {
    try {
      const meta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
      return meta.inlineForm === true
    } catch {
      return false
    }
  }, [tableSchema?.comment])
}

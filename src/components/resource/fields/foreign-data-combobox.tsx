import { useEffect, useRef } from "react"

import { useStore } from "@tanstack/react-form"
import { useQuery } from "@tanstack/react-query"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "#/components/ui/item"
import type { FKBehavior, Relationship } from "#/lib/database-meta.types"
import { resourceDataQueryOptions } from "#/lib/supabase/data/resource"
import type { FieldProps } from "#/types/fields"

import type { ResourceFormApi } from "../form-hook"
import { useFieldContext } from "../form-hook"

type JoinConfig = { table: string; on: string; columns: string[] }

export function ForeignDataCombobox({
  columnMetadata,
  relationship,
  joinConfig,
  behavior,
  form,
  onRecordSelect,
}: FieldProps & {
  relationship: Relationship
  joinConfig: JoinConfig
  behavior?: FKBehavior
  form?: ResourceFormApi
  onRecordSelect?: (record: Record<string, unknown>) => void
}) {
  const field = useFieldContext<unknown>()
  const displayColumn = joinConfig.columns[0]

  // Watch filter dependencies reactively
  const filterRules = behavior?.filter ?? []
  const watchedValues = useStore(
    // If no base store is provided, cast a minimal fallback to unknown first to
    // satisfy TypeScript when coercing to the expected BaseAtom type.
    (form?.baseStore ?? ({ subscribe: () => () => {} } as unknown)) as
      Parameters<typeof useStore>[0],
    (s) => {
      const vals: Record<string, unknown> = {}
      for (const rule of filterRules) {
        vals[rule.on] = (s as { values: Record<string, unknown> }).values?.[rule.on]
      }
      return vals
    }
  )

  // Clear this field's value when any filter dependency changes
  const prevWatchedRef = useRef(watchedValues)
  useEffect(() => {
    if (!filterRules.length) return
    const prev = prevWatchedRef.current
    const changed = filterRules.some((r) => prev[r.on] !== watchedValues[r.on])
    if (changed) {
      prevWatchedRef.current = watchedValues
      field.handleChange(null)
    }
  }, [watchedValues]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build dynamic filters from filter rules
  const dynamicFilters = filterRules
    .filter((r) => watchedValues[r.on] != null && watchedValues[r.on] !== "")
    .map((r) => ({ id: r.column, value: `eq.${watchedValues[r.on]}` }))

  // Build select columns: PK + join display columns + fill source columns
  const fillSourceColumns = behavior?.fill?.map((r) => r.source) ?? []
  const selectColumns = [
    relationship.target_column_name,
    ...joinConfig.columns.filter((c) => c !== relationship.target_column_name),
    ...fillSourceColumns.filter(
      (c) =>
        c !== relationship.target_column_name && !joinConfig.columns.includes(c)
    ),
  ]

  const { data } = useQuery(
    resourceDataQueryOptions(
      relationship.target_table_schema,
      relationship.target_table_name,
      { select: selectColumns },
      1,
      100,
      undefined,
      undefined,
      dynamicFilters
    )
  )

  const records: Record<string, unknown>[] = data?.result ?? []

  const selectedRecord =
    records.find(
      (r) =>
        r[relationship.target_column_name]?.toString() ===
        field.state.value?.toString()
    ) ?? null

  return (
    <Combobox<Record<string, unknown>>
      value={selectedRecord}
      onValueChange={(record) => {
        field.handleChange(
          record ? record[relationship.target_column_name] : null
        )
        if (record) onRecordSelect?.(record)
      }}
      items={records}
      itemToStringLabel={(record) =>
        String(record[relationship.target_column_name] ?? "")
      }
      isItemEqualToValue={(item, val) =>
        item[relationship.target_column_name] ===
        val[relationship.target_column_name]
      }
      disabled={columnMetadata.disabled}
    >
      <ComboboxInput
        showClear={!columnMetadata.required}
        placeholder={`Search ${relationship.target_table_name}...`}
        className="w-full"
      />
      <ComboboxContent>
        <ComboboxEmpty>No records found.</ComboboxEmpty>
        <ComboboxList>
          {(record) => (
            <ComboboxItem
              key={String(record[relationship.target_column_name])}
              value={record}
            >
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {String(record[displayColumn] ?? "")}
                  </ItemTitle>
                  <ItemDescription>
                    {String(record[relationship.target_column_name] ?? "")}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

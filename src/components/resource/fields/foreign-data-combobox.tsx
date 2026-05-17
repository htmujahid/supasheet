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
import type { Relationship } from "#/lib/database-meta.types"
import { resourceDataQueryOptions } from "#/lib/supabase/data/resource"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"

type JoinConfig = { table: string; on: string; columns: string[] }

export function ForeignDataCombobox({
  columnMetadata,
  relationship,
  joinConfig,
}: FieldProps & {
  relationship: Relationship
  joinConfig: JoinConfig
}) {
  const field = useFieldContext<unknown>()
  const displayColumn = joinConfig.columns[0]

  const { data } = useQuery(
    resourceDataQueryOptions(
      relationship.target_table_schema,
      relationship.target_table_name,
      {
        select: [
          relationship.target_column_name,
          ...joinConfig.columns.filter(
            (c) => c !== relationship.target_column_name
          ),
        ],
      },
      1,
      100
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
      onValueChange={(record) =>
        field.handleChange(record ? record[relationship.target_column_name] : null)
      }
      items={records}
      itemToStringLabel={(record) =>
        String(record[relationship.target_column_name] ?? "")
      }
      isItemEqualToValue={(item, val) =>
        item[relationship.target_column_name] === val[relationship.target_column_name]
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

import { useMemo } from "react"

import { useNavigate } from "@tanstack/react-router"

import type { ColumnFiltersState } from "@tanstack/react-table"

import { ChevronDownIcon, FilterIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { encodeFilterValue } from "#/lib/data-table"
import type { FilterTemplate } from "#/lib/database-meta.types"
import type { FilterOperator } from "#/types/data-table"

const ALL_RECORDS_ID = "__all__"

function encodeTemplateFilters(template: FilterTemplate): ColumnFiltersState {
  return template.filters.map((f) => ({
    id: f.id,
    value: encodeFilterValue(f.operator as FilterOperator, f.value),
  }))
}

function filtersEqual(a: ColumnFiltersState, b: ColumnFiltersState): boolean {
  if (a.length !== b.length) return false
  const bById = new Map(b.map((f) => [f.id, f.value]))
  return a.every((f) => bById.get(f.id) === f.value)
}

export function ResourceFilterTemplates({
  filterTemplates,
  currentFilters,
}: {
  filterTemplates: FilterTemplate[]
  currentFilters: ColumnFiltersState
}) {
  const navigate = useNavigate()

  const activeTemplateId = useMemo(() => {
    if (currentFilters.length === 0) return ALL_RECORDS_ID
    const match = filterTemplates.find((t) =>
      filtersEqual(encodeTemplateFilters(t), currentFilters)
    )
    return match?.id
  }, [filterTemplates, currentFilters])

  if (filterTemplates.length === 0) return null

  const activeTemplate = filterTemplates.find((t) => t.id === activeTemplateId)
  const triggerLabel =
    activeTemplateId === ALL_RECORDS_ID
      ? "All records"
      : (activeTemplate?.name ?? "Custom filter")

  function handleSelect(value: string) {
    if (value === ALL_RECORDS_ID) {
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, filters: undefined, page: 1 }),
      })
      return
    }
    const template = filterTemplates.find((t) => t.id === value)
    if (!template) return
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        filters: encodeTemplateFilters(template),
        page: 1,
      }),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
        <FilterIcon className="size-3" />
        <span className="truncate font-medium">{triggerLabel}</span>
        <ChevronDownIcon className="size-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit rounded-lg">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter templates</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={activeTemplateId}
          onValueChange={handleSelect}
        >
          <DropdownMenuRadioItem value={ALL_RECORDS_ID}>
            All records
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {filterTemplates.map((template) => (
            <DropdownMenuRadioItem key={template.id} value={template.id}>
              {template.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

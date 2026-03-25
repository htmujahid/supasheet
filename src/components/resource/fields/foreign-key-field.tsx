import { useState } from "react"

import { ButtonGroup } from "#/components/ui/button-group"
import { DropdownMenuItem } from "#/components/ui/dropdown-menu"
import { Input } from "#/components/ui/input"
import type { Relationship } from "#/lib/database-meta.types"
import type { FieldProps } from "#/types/fields"

import { ForeignTableSheet } from "../foreign-table"
import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function ForeignKeyField({
  columnMetadata,
  relationship,
}: FieldProps & {
  relationship: Relationship
}) {
  const field = useFieldContext<unknown>()
  const [open, setOpen] = useState(false)

  const placeholder =
    field.state.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.state.value === null
        ? "NULL"
        : "EMPTY"

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Input
          name={field.name}
          value={field.state.value as string}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={columnMetadata.disabled}
          placeholder={placeholder}
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      >
        <DropdownMenuItem onClick={() => setOpen(true)}>
          Select Record
        </DropdownMenuItem>
      </FieldOptionDropdown>
      {open && (
        <ForeignTableSheet
          open={open}
          onOpenChange={setOpen}
          relationship={relationship}
          setRecord={(record) => {
            field.handleChange(record[relationship.target_column_name])
            setOpen(false)
          }}
        />
      )}
    </ButtonGroup>
  )
}

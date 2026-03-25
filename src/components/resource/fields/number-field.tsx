import { ButtonGroup } from "#/components/ui/button-group"
import { Input } from "#/components/ui/input"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function NumberField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
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
          type="number"
          name={field.name}
          value={field.state.value as string}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          disabled={columnMetadata.disabled}
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      />
    </ButtonGroup>
  )
}

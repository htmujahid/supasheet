import { ButtonGroup } from "#/components/ui/button-group"
import { Textarea } from "#/components/ui/textarea"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function JsonField({ columnMetadata }: FieldProps) {
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
        <Textarea
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

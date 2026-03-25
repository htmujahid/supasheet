import { ButtonGroup } from "#/components/ui/button-group"
import { Input } from "#/components/ui/input"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function MoneyField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
  const placeholder =
    field.state.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.state.value === null
        ? "NULL"
        : "EMPTY"

  const raw = (field.state.value as string) ?? "0"
  const value = parseFloat(
    (raw.startsWith("$") ? raw.slice(1) : raw).replace(/,/g, "")
  ).toFixed(2)

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Input
          type="number"
          name={field.name}
          value={value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          disabled={columnMetadata.disabled}
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(v) => field.handleChange(v)}
      />
    </ButtonGroup>
  )
}

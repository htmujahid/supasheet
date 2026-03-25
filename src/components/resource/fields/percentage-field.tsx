import { ButtonGroup } from "#/components/ui/button-group"
import { Slider } from "#/components/ui/slider"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function PercentageField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Slider
          value={[field.state.value as number]}
          onValueChange={(v) => field.handleChange(Array.isArray(v) ? v[0] : v)}
          min={0}
          max={100}
          step={1}
          disabled={columnMetadata.disabled}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {(field.state.value as number)?.toString()}%
          </span>
        </div>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      />
    </ButtonGroup>
  )
}

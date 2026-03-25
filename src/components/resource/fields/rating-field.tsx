import { ButtonGroup } from "#/components/ui/button-group"
import { Rating, RatingItem } from "#/components/ui/rating"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function RatingField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Rating
          onValueChange={(v) => field.handleChange(v)}
          value={field.state.value as number}
          step={0.5}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingItem key={index} />
          ))}
        </Rating>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      />
    </ButtonGroup>
  )
}

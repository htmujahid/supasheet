import { ButtonGroup } from "#/components/ui/button-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

export function SelectField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Select
          name={field.name}
          onValueChange={(value) => field.handleChange(value)}
          value={field.state.value as string}
          defaultValue={field.state.value?.toString()}
          disabled={columnMetadata.disabled}
        >
          <SelectTrigger className="w-full [&>svg]:hidden">
            {field.state.value === "" && columnMetadata.defaultValue ? (
              <span className="text-muted-foreground">DEFAULT VALUE</span>
            ) : field.state.value === null ? (
              <span className="text-muted-foreground">NULL</span>
            ) : (
              <SelectValue placeholder="Select an option" />
            )}
          </SelectTrigger>
          <SelectContent>
            {columnMetadata.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      />
    </ButtonGroup>
  )
}

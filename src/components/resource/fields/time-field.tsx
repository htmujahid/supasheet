import { ButtonGroup } from "#/components/ui/button-group"
import { DropdownMenuItem } from "#/components/ui/dropdown-menu"
import { Input } from "#/components/ui/input"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"
import { FieldOptionDropdown } from "./field-option-dropdown"

function getUserTimezone(): string {
  const offset = new Date().getTimezoneOffset()
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  const sign = offset <= 0 ? "+" : "-"
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

function convertTimeToUserTimezone(value: string | null): string {
  if (!value) return ""

  const normalizedValue = value.replace(/([+-])(\d{2})$/, "$1$2:00")
  const today = new Date().toISOString().split("T")[0]
  const isoString = `${today}T${normalizedValue}`

  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return value.replace(/[+-]\d{2}(:\d{2})?$/, "")
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  } catch {
    return value.replace(/[+-]\d{2}(:\d{2})?$/, "")
  }
}

function getTimeWithTimezone(timeValue: string): string | null {
  if (!timeValue) return null
  return `${timeValue}${getUserTimezone()}`
}

export function TimeField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
  const inputValue = convertTimeToUserTimezone(field.state.value as string)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.handleChange(getTimeWithTimezone(e.target.value))
  }

  const handleNow = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    field.handleChange(`${hours}:${minutes}:${seconds}${getUserTimezone()}`)
  }

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="relative w-full">
        <Input
          type="time"
          name={field.name}
          value={inputValue}
          onChange={handleChange}
          onBlur={field.handleBlur}
          disabled={columnMetadata.disabled}
        />
        <div className="absolute top-2.5 right-2 text-xs">
          {field.state.value === "" && columnMetadata.defaultValue ? (
            <span className="text-muted-foreground">DEFAULT VALUE</span>
          ) : field.state.value === null ? (
            <span className="text-muted-foreground">NULL</span>
          ) : (
            <span className="text-muted-foreground">EMPTY</span>
          )}
        </div>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => field.handleChange(value)}
      >
        <DropdownMenuItem onClick={handleNow}>NOW</DropdownMenuItem>
      </FieldOptionDropdown>
    </ButtonGroup>
  )
}

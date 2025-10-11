import { ChangeEvent, useEffect, useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import type { FieldProps } from "./types";
import { FieldOptionDropdown } from "./field-option-dropdown";

export function DurationField({ field, columnMetadata }: FieldProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const ms = parseInt(field.value as string) || 0
    const totalSeconds = ms / 1000

    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = (totalSeconds % 60).toFixed(3) as unknown as number

    setHours(h)
    setMinutes(m)
    setSeconds(s)
  }, [field.value])

  const emitChange = (h: number, m: number, s: number) => {
    const totalSeconds = h * 3600 + m * 60 + s
    const totalMs = totalSeconds * 1000
    field.onChange?.(totalMs)
  }

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const h = value === "" ? 0 : Math.max(0, parseInt(value) || 0)
    setHours(h)
    emitChange(h, minutes, seconds)
  }

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const m = value === "" ? 0 : Math.max(0, parseInt(value) || 0)
    setMinutes(m)
    emitChange(hours, m, seconds)
  }

  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const s = value === "" ? 0 : Math.max(0, parseFloat(value) || 0)
    setSeconds(s)
    emitChange(hours, minutes, s)
  }

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <InputGroup>
          <InputGroupAddon>h</InputGroupAddon>
          <InputGroupInput
            type="number"
            value={hours}
            onChange={handleHoursChange}
            disabled={columnMetadata.disabled}
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>m</InputGroupAddon>
          <InputGroupInput
            type="number"
            value={minutes}
            onChange={handleMinutesChange}
            disabled={columnMetadata.disabled}
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>s</InputGroupAddon>
          <InputGroupInput
            type="number"
            step="0.001"
            value={seconds}
            onChange={handleSecondsChange}
            disabled={columnMetadata.disabled}
          />
        </InputGroup>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => {
          field.onChange(value);
        }}
      />
    </ButtonGroup>
  );
}

import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

function getUserTimezone(): string {
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  const sign = offset <= 0 ? "+" : "-";
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function convertTimeToUserTimezone(value: string | null): string {
  if (!value) return "";

  // Normalize timezone format: "10:30:00+05" -> "10:30:00+05:00"
  const normalizedValue = value.replace(/([+-])(\d{2})$/, "$1$2:00");

  // Create a full ISO string with today's date
  const today = new Date().toISOString().split("T")[0];
  const isoString = `${today}T${normalizedValue}`;

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return value.replace(/[+-]\d{2}(:\d{2})?$/, "");
    }

    // Get local time in 24-hour format for the input
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return value.replace(/[+-]\d{2}(:\d{2})?$/, "");
  }
}

function getTimeWithTimezone(timeValue: string): string | null {
  if (!timeValue) return null;
  return `${timeValue}${getUserTimezone()}`;
}

export function TimeField({ field, columnMetadata }: FieldProps) {
  const inputValue = convertTimeToUserTimezone(field.value as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(getTimeWithTimezone(e.target.value));
  };

  const handleNow = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    field.onChange(`${hours}:${minutes}:${seconds}${getUserTimezone()}`);
  };

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="relative w-full">
        <Input
          type="time"
          {...field}
          value={inputValue}
          onChange={handleChange}
          disabled={columnMetadata.disabled}
        />
        <div className="absolute top-2.5 right-2 text-xs">
          {field.value === "" && columnMetadata.defaultValue ? (
            <span className="text-muted-foreground">DEFAULT VALUE</span>
          ) : field.value === null ? (
            <span className="text-muted-foreground">NULL</span>
          ) : (
            <span className="text-muted-foreground">EMPTY</span>
          )}
        </div>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => {
          field.onChange(value);
        }}
      >
        <DropdownMenuItem onClick={handleNow}>NOW</DropdownMenuItem>
      </FieldOptionDropdown>
    </ButtonGroup>
  );
}

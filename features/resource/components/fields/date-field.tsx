import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function DateField({ field, columnInput }: FieldProps) {
  return (
    <div className="relative w-full">
      <Input
        type="date"
        {...field}
        value={field.value as string}
        disabled={columnInput.disabled}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
      <div className="absolute top-2.5 right-8 text-xs">
        {field.value === "" && columnInput.defaultValue ? (
          <span className="text-muted-foreground">DEFAULT VALUE</span>
        ) : field.value === null ? (
          <span className="text-muted-foreground">NULL</span>
        ) : (
          <span className="text-muted-foreground">EMPTY</span>
        )}
      </div>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          field.onChange(value);
        }}
      >
        <DropdownMenuItem
          onClick={() => field.onChange(new Date().toISOString().slice(0, 10))}
        >
          NOW
        </DropdownMenuItem>
      </FieldOptionDropdown>
    </div>
  );
}

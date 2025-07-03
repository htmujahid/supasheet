import { FieldPath } from "react-hook-form";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function TimeField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);
  return (
    <div className="relative">
      <Input
        type="time"
        {...form.register(column.name as FieldPath<TableSchema>, {
          required:
            columnInput.required && !column.default_value
              ? `${column.name} is required`
              : false,
          setValueAs: (value) => {
            if (value === "") {
              return undefined;
            }
            return value;
          },
        })}
        disabled={columnInput.disabled}
        placeholder={
          value === undefined && columnInput.defaultValue
            ? `DEFAULT: ${columnInput.defaultValue}`
            : value === null
              ? "NULL"
              : "EMPTY"
        }
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
      <div className="absolute top-2.5 right-9 text-xs">
        {value === undefined && columnInput.defaultValue}
        {value === null && "NULL"}
      </div>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
      >
        <DropdownMenuItem
          onClick={() =>
            form.setValue(
              column.name as FieldPath<TableSchema>,
              new Date().toISOString().slice(11, 16),
            )
          }
        >
          NOW
        </DropdownMenuItem>
      </FieldOptionDropdown>
    </div>
  );
}

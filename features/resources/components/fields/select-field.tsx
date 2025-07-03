import { FieldPath } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function SelectField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);

  return (
    <div className="relative">
      <Select
        {...form.register(column.name as FieldPath<TableSchema>, {
          required:
            columnInput.required && !column.default_value
              ? `${column.name} is required`
              : false,
        })}
        onValueChange={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
        defaultValue={
          value === null
            ? "null"
            : value === undefined
              ? undefined
              : (value as string)
        }
        disabled={columnInput.disabled}
      >
        <SelectTrigger className="w-full [&>svg]:hidden">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {(column.enums as string[])?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
      />
    </div>
  );
}

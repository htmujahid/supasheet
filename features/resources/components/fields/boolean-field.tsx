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

export function BooleanField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);

  return (
    <div className="relative">
      <Select
        {...form.register(column.name as FieldPath<TableSchema>)}
        onValueChange={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
        defaultValue={
          value === null
            ? "null"
            : value === undefined
              ? undefined
              : value?.toString()
        }
        disabled={columnInput.disabled}
      >
        <SelectTrigger className="w-full [&>svg]:hidden">
          {value === undefined && columnInput.defaultValue ? (
            <span className="text-muted-foreground">DEFAULT VALUE</span>
          ) : (
            <SelectValue placeholder={"Select an option"} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
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

import { FieldPath } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function TextField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);

  return (
    <div className="relative">
      <Textarea
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
        placeholder={value === null ? "NULL" : "EMPTY"}
        disabled={columnInput.disabled}
      />
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
      />
    </div>
  );
}

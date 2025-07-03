import { FieldPath } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function TextField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);
  const placeholder =
    value === undefined && columnInput.defaultValue
      ? "DEFAULT VALUE"
      : value === null
        ? "NULL"
        : "EMPTY";

  return (
    <div className="relative">
      <Textarea
        {...form.register(column.name as FieldPath<TableSchema>, {
          setValueAs: (value) => {
            if (value === "") {
              return undefined;
            }
            return value;
          },
        })}
        placeholder={placeholder}
        disabled={columnInput.disabled}
      />
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          form.resetField(column.name as string);
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
      />
    </div>
  );
}

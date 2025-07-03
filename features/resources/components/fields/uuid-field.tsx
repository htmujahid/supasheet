import type { FieldPath } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { TableSchema } from "@/lib/database-meta.types";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function UuidField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);

  const placeholder =
    value === undefined && columnInput.defaultValue
      ? "DEFAULT VALUE"
      : value === null
        ? "NULL"
        : "EMPTY";

  return (
    <div className="relative">
      <Input
        {...form.register(column.name as FieldPath<TableSchema>, {
          setValueAs: (value) => {
            if (value === "") {
              return undefined;
            }
            return value;
          },
        })}
        placeholder={placeholder}
        defaultValue={
          column.default_value === "gen_random_uuid()" ||
          column.default_value === "gen_random_uuid()"
            ? crypto.randomUUID()
            : undefined
        }
        disabled={columnInput.disabled}
        type="text"
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

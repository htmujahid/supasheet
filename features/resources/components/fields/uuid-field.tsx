import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function UuidField({ field, columnInput }: FieldProps) {
  const placeholder =
    field.value === "" && columnInput.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <div className="relative w-full">
      <Input
        {...field}
        value={field.value as string}
        placeholder={placeholder}
        defaultValue={
          columnInput.defaultValue === "gen_random_uuid()" ||
          columnInput.defaultValue === "gen_random_uuid()"
            ? crypto.randomUUID()
            : undefined
        }
        disabled={columnInput.disabled}
        type="text"
      />
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          field.onChange(value);
        }}
      />
    </div>
  );
}

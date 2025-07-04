import { Textarea } from "@/components/ui/textarea";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function JsonField({ field, columnInput }: FieldProps) {
  const placeholder =
    field.value === "" && columnInput.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <div className="relative w-full">
      <Textarea
        {...field}
        value={field.value as string}
        placeholder={placeholder}
        disabled={columnInput.disabled}
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

import { Textarea } from "@/components/ui/textarea";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";
import { ButtonGroup } from "@/components/ui/button-group";

export function LongtextField({ field, columnInput }: FieldProps) {
  const placeholder =
    field.value === "" && columnInput.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Textarea
          {...field}
          rows={1}
          value={field.value as string}
          placeholder={placeholder}
          disabled={columnInput.disabled}
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          field.onChange(value);
        }}
      />
    </ButtonGroup>
  );
}

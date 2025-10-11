import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function MoneyField({ field, columnMetadata }: FieldProps) {
  const placeholder =
    field.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  const value = parseFloat(
    ((field.value as string).startsWith("$")
      ? (field.value as string).slice(1)
      : ((field.value as string) ?? "0")
    ).replace(/,/g, ""),
  ).toFixed(2);

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Input
          type="number"
          {...field}
          value={value}
          placeholder={placeholder}
          disabled={columnMetadata.disabled}
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => {
          field.onChange(value);
        }}
      />
    </ButtonGroup>
  );
}

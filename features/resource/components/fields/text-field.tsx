import { FieldOptionDropdown } from "./field-option-dropdown";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

import type { FieldProps } from "./types";

export function TextField({ field, columnMetadata }: FieldProps) {
  const placeholder =
    field.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Input
          type={columnMetadata.type}
          {...field}
          value={field.value as string}
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

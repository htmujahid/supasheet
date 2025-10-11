import { Textarea } from "@/components/ui/textarea";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";
import { ButtonGroup } from "@/components/ui/button-group";

export function JsonField({ field, columnMetadata }: FieldProps) {
  const placeholder =
    field.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Textarea
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

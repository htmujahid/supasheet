import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function UuidField({ field, columnMetadata }: FieldProps) {
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
          {...field}
          value={field.value as string}
          placeholder={placeholder}
          defaultValue={
            columnMetadata.defaultValue === "gen_random_uuid()" ||
            columnMetadata.defaultValue === "gen_random_uuid()"
              ? crypto.randomUUID()
              : undefined
          }
          disabled={columnMetadata.disabled}
          type="text"
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

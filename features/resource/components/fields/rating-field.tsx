import { Rating, RatingButton } from "@/components/kibo-ui/rating";
import { ButtonGroup } from "@/components/ui/button-group";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function RatingField({ field, columnMetadata }: FieldProps) {
  const placeholder =
    field.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Rating onValueChange={field.onChange} value={field.value as number}>
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} />
          ))}
        </Rating>
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

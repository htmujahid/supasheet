import { Rating, RatingItem } from "@/components/ui/rating";
import { ButtonGroup } from "@/components/ui/button-group";

import { FieldOptionDropdown } from "./field-option-dropdown";
import type { FieldProps } from "./types";

export function RatingField({ field, columnMetadata }: FieldProps) {
  // const placeholder =
  //   field.value === "" && columnMetadata.defaultValue
  //     ? "DEFAULT VALUE"
  //     : field.value === null
  //       ? "NULL"
  //       : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Rating {...field} onValueChange={field.onChange} value={field.value as number} step={0.5}>
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingItem key={index} />
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

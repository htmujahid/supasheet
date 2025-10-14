import { ButtonGroup } from "@/components/ui/button-group";
import { Slider } from "@/components/ui/slider";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function PercentageField({ field, columnMetadata }: FieldProps) {
  // const placeholder =
  //   field.value === "" && columnMetadata.defaultValue
  //     ? "DEFAULT VALUE"
  //     : field.value === null
  //       ? "NULL"
  //       : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Slider
          {...field}
          value={[field.value as number]}
          onValueChange={(v) => {
            field.onChange(v[0])
          }}
          min={0}
          max={100}
          step={1}
          disabled={columnMetadata.disabled}
        />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{field.value?.toString()}%</span>
      </div>
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

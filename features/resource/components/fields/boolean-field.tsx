import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function BooleanField({ field, columnMetadata }: FieldProps) {
  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Select
          {...field}
          onValueChange={(value) => {
            field.onChange(value);
          }}
          value={field.value as string}
          disabled={columnMetadata.disabled}
        >
          <SelectTrigger className="w-full [&>svg]:hidden">
            {field.value === "" && columnMetadata.defaultValue ? (
              <span className="text-muted-foreground">DEFAULT VALUE</span>
            ) : field.value === null ? (
              <span className="text-muted-foreground">NULL</span>
            ) : (
              <SelectValue placeholder={"Select an option"} />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
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

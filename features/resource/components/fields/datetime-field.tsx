import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function DatetimeField({ field, columnMetadata }: FieldProps) {
  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="relative w-full">
        <Input
          type="datetime-local"
          {...field}
          value={field.value?.toString().slice(0, 16)}
          disabled={columnMetadata.disabled}
        />
        <div className="absolute top-2.5 right-10 text-xs">
          {field.value === "" && columnMetadata.defaultValue ? (
            <span className="text-muted-foreground">DEFAULT VALUE</span>
          ) : field.value === null ? (
            <span className="text-muted-foreground">NULL</span>
          ) : (
            <span className="text-muted-foreground">EMPTY</span>
          )}
        </div>
      </ButtonGroup>
      <FieldOptionDropdown
        columnMetadata={columnMetadata}
        setValue={(value) => {
          field.onChange(value);
        }}
      >
        <DropdownMenuItem
          onClick={() => field.onChange(new Date().toISOString().slice(0, 16))}
        >
          NOW
        </DropdownMenuItem>
      </FieldOptionDropdown>
    </ButtonGroup>
  );
}

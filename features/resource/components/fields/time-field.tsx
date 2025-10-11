import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";
import { ButtonGroup } from "@/components/ui/button-group";

export function TimeField({ field, columnMetadata }: FieldProps) {
  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="relative w-full">
        <Input
          type="time"
          {...field}
          value={field.value as string}
          disabled={columnMetadata.disabled}
        />
        <div className="absolute top-2.5 right-2 text-xs">
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
          onClick={() => field.onChange(new Date().toISOString().slice(11, 16))}
        >
          NOW
        </DropdownMenuItem>
      </FieldOptionDropdown>
    </ButtonGroup>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function SelectField({ field, columnInput }: FieldProps) {
  return (
    <div className="relative w-full">
      <Select
        {...field}
        onValueChange={(value) => {
          field.onChange(value);
        }}
        value={field.value as string}
        defaultValue={field.value?.toString()}
        disabled={columnInput.disabled}
      >
        <SelectTrigger className="w-full [&>svg]:hidden">
          {field.value === "" && columnInput.defaultValue ? (
            <span className="text-muted-foreground">DEFAULT VALUE</span>
          ) : field.value === null ? (
            <span className="text-muted-foreground">NULL</span>
          ) : (
            <SelectValue placeholder={"Select an option"} />
          )}
        </SelectTrigger>
        <SelectContent>
          {columnInput.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          field.onChange(value);
        }}
      />
    </div>
  );
}

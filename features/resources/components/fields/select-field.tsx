import { FieldPath } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldProps } from "./types";

export function SelectField({ form, columnInput, column }: FieldProps) {
  return (
    <Select
      {...form.register(column.name as FieldPath<TableSchema>, {
        required: columnInput.required ? `${column.name} is required` : false,
      })}
      onValueChange={(value) => {
        form.setValue(column.name as FieldPath<TableSchema>, value);
      }}
      defaultValue={columnInput.defaultValue as string}
      disabled={columnInput.disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {(column.enums as string[])?.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

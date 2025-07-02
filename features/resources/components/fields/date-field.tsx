import { FieldPath } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldProps } from "./types";

export function DateField({ form, columnInput, column }: FieldProps) {
  return (
    <Input
      type="date"
      {...form.register(column.name as FieldPath<TableSchema>, {
        required: columnInput.required ? `${column.name} is required` : false,
      })}
      disabled={columnInput.disabled}
      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  );
}

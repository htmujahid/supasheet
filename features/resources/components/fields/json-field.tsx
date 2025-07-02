import { FieldPath } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldProps } from "./types";

export function JsonField({ form, columnInput, column }: FieldProps) {
  return (
    <Textarea
      {...form.register(column.name as FieldPath<TableSchema>, {
        required: !columnInput.required ? `${column.name} is required` : false,
      })}
      disabled={columnInput.disabled}
    />
  );
}

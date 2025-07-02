import type { FieldPath } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { TableSchema } from "@/lib/database-meta.types";

import type { FieldProps } from "./types";

export function UuidField({ form, columnInput, column }: FieldProps) {
  return (
    <Input
      {...form.register(column.name as FieldPath<TableSchema>, {
        required: columnInput.required ? `${column.name} is required` : false,
      })}
      disabled={columnInput.disabled}
      type="text"
    />
  );
}

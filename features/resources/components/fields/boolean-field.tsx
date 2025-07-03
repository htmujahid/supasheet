import { FieldPath } from "react-hook-form";

import { If } from "@/components/makerkit/if";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSchema } from "@/lib/database-meta.types";

import { FieldProps } from "./types";

export function BooleanField({ form, columnInput, column }: FieldProps) {
  const value = form.getValues(column.name as FieldPath<TableSchema>);

  return (
    <div className="relative">
      <Select
        {...form.register(column.name as FieldPath<TableSchema>, {
          required:
            columnInput.required && !column.default_value
              ? `${column.name} is required`
              : false,
        })}
        onValueChange={(value) => {
          form.setValue(column.name as FieldPath<TableSchema>, value);
        }}
        defaultValue={
          value === null
            ? "null"
            : value === undefined
              ? undefined
              : (value as string)
        }
        disabled={columnInput.disabled}
      >
        <SelectTrigger className="w-full [&>svg]:hidden">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <If condition={!columnInput.required}>
            <SelectItem
              value="null"
              onClick={() =>
                form.setValue(column.name as FieldPath<TableSchema>, null)
              }
            >
              NULL
            </SelectItem>
          </If>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

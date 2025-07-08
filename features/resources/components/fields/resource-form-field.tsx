import { FieldPath, UseFormReturn } from "react-hook-form";

import { If } from "@/components/makerkit/if";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Relationship, TableSchema } from "@/lib/database-meta.types";
import { Tables } from "@/lib/database.types";

import { getDataTypeIcon } from "../icons";
import { AllFields } from "./all-fields";
import { ArrayField } from "./array-field";
import { ForeignKeyField } from "./foreign-key-field";
import { ColumnInput } from "./types";
import { getColumnInputField } from "./utils";

export function ResourceFormField({
  column,
  tableSchema,
  form,
}: {
  column: Tables<"_pg_meta_columns">;
  tableSchema: Tables<"_pg_meta_tables"> | null;
  form: UseFormReturn<TableSchema>;
}) {
  let columnInput: ColumnInput;

  if (column.data_type === "ARRAY") {
    let data_type = column.actual_type?.toString().slice(1) ?? null;

    if ((column.enums as string[])?.length) {
      data_type = "USER-DEFINED";
    }

    columnInput = getColumnInputField({
      ...column,
      data_type,
    });
  } else {
    columnInput = getColumnInputField(column);
  }

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (relationship) =>
      relationship.source_column_name === column.name &&
      relationship.target_table_schema === "public",
  );

  return (
    <FormField
      key={column.id}
      control={form.control}
      disabled={columnInput.disabled}
      name={column.name as FieldPath<TableSchema>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {column.name as string} {getDataTypeIcon(column)}{" "}
            {columnInput.required && (
              <span className="text-destructive">*</span>
            )}
          </FormLabel>
          <FormControl>
            <div>
              {column.data_type === "ARRAY" ? (
                <ArrayField
                  form={form}
                  columnInput={columnInput}
                  field={field}
                  control={form.control}
                />
              ) : relationship ? (
                <ForeignKeyField
                  field={field}
                  columnInput={columnInput}
                  relationship={relationship}
                />
              ) : (
                <AllFields field={field} columnInput={columnInput} />
              )}
            </div>
          </FormControl>
          <If condition={columnInput.defaultValue}>
            {(defaultValue) => (
              <FormDescription>DEFAULT: {defaultValue}</FormDescription>
            )}
          </If>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

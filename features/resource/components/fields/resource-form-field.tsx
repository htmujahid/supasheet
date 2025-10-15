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
import {
  ColumnSchema,
  Relationship,
  ResourceDataSchema,
  TableSchema,
} from "@/lib/database-meta.types";

import { getColumnMetadata } from "../../lib/columns";
import { getDataTypeIcon } from "../icons";
import { AllFields } from "./all-fields";
import { ArrayField } from "./array-field";
import { FileField } from "./file-field";
import { ForeignKeyField } from "./foreign-key-field";
import { ColumnMetadata } from "./types";
import { AvatarField } from "./avatar-field";
import { formatTitle } from "@/lib/format";

export function ResourceFormField({
  columnSchema,
  tableSchema,
  form,
}: {
  columnSchema: ColumnSchema;
  tableSchema: TableSchema | null;
  form: UseFormReturn<ResourceDataSchema>;
}) {
  let columnMetadata: ColumnMetadata;

  if (columnSchema.data_type === "ARRAY") {
    let data_type = columnSchema.actual_type?.toString().slice(1) ?? null;

    if ((columnSchema.enums as string[])?.length) {
      data_type = "USER-DEFINED";
    }

    columnMetadata = getColumnMetadata({
      ...columnSchema,
      data_type,
    });
  } else {
    columnMetadata = getColumnMetadata(columnSchema);
  }

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (relationship) =>
      relationship.source_column_name === columnSchema.name &&
      relationship.source_schema === columnSchema.schema,
  );

  return (
    <FormField
      key={columnSchema.id}
      control={form.control}
      disabled={columnMetadata.disabled}
      rules={{ required: columnMetadata.required }}
      name={columnSchema.name as FieldPath<ResourceDataSchema>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {getDataTypeIcon(columnSchema)}{" "}
            {formatTitle(columnSchema.name ?? "")}{" "}
            {columnMetadata.required && (
              <span className="text-destructive">*</span>
            )}
          </FormLabel>
          <FormControl>
            <div>
              {columnSchema.format === "file" ? (
                <FileField
                  form={form}
                  columnMetadata={columnMetadata}
                  field={field}
                  control={form.control}
                  columnSchema={columnSchema}
                />
              ) : columnSchema.format === "avatar" ? (
                <AvatarField
                  form={form}
                  columnMetadata={columnMetadata}
                  field={field}
                  control={form.control}
                  columnSchema={columnSchema}
                />
              ) : columnSchema.data_type === "ARRAY" ? (
                <ArrayField
                  form={form}
                  columnMetadata={columnMetadata}
                  field={field}
                  control={form.control}
                />
              ) : relationship ? (
                <ForeignKeyField
                  field={field}
                  columnMetadata={columnMetadata}
                  relationship={relationship}
                />
              ) : (
                <AllFields field={field} columnMetadata={columnMetadata} />
              )}
            </div>
          </FormControl>
          <If condition={columnMetadata.defaultValue}>
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
